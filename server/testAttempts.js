const router = require("express").Router();
const _ = require("lodash");
const moment = require("moment");
const TestAttempts = require("./testAttemptsDAO");
module.exports = router;

router.post("/", (req, res) => {
  let filters = req.body.filters || undefined;
  let q, qVars;
  if (req.body.testId) {
    q = `SELECT u.first_name, u.last_name, u.email_address, CONCAT(u.first_name,(' '||u.last_name)) as display_name, t.*, a.*, a.id as test_attempt_id FROM "test_attempts" as a 
    left join "users" as u on a.user_id = u.id 
    left  join "tests" as t on t.id = a.test_id
    where a.invited_by = $1 and t.id = $2`;
    qVars = [req.body.userId, req.body.testId];
  } else {
    q = `SELECT u.first_name, u.last_name, u.email_address, CONCAT(u.first_name,(' '||u.last_name)) as display_name, t.*, a.*, a.id as test_attempt_id FROM "test_attempts" as a 
  left join "users" as u on a.user_id = u.id 
  left  join "tests" as t on t.id = a.test_id
  where a.invited_by = $1`;
    qVars = [req.body.userId];
  }

  return req.db.any(q, qVars).then(d => {
    if (filters && filters.user) {
      d = d.filter(i => i.display_name === filters.user.value);
    }
    if (filters && filters.email) {
      d = d.filter(i => i.email_address === filters.email.value);
    }
    if (filters && filters.status && filters.status === "completed") {
      d = d.filter(i => i.completed_at);
    } else if (filters && filters.status && filters.status === "waiting") {
      d = d.filter(i => !i.completed_at);
    }
    if (filters && filters.daterange) {
      d = d.filter(i => {
        return (
          moment(i.invited_at).isAfter(
            moment(filters.daterange.startDate).startOf("day")
          ) &&
          moment(i.invited_at).isBefore(
            moment(filters.daterange.endDate).endOf("day")
          )
        );
      });
    }
    return res.send(d);
  });
});

router.get("/findOne/:id", (req, res) => {
  return req.db
    .any(
      `SELECT u.first_name, u.last_name, t.*, a.* FROM "test_attempts" as a 
    left join "users" as u on a.user_id = u.id 
    left join "tests" as t on t.id = a.test_id
    where a.id = $1`,
      [req.params.id]
    )
    .then(d => {
      return res.send(d);
    });
});

router.post("/create", (req, res) => {
  console.log(req.body);
  return req.db
    .any(
      "INSERT INTO test_attempts(invited_at, user_id, test_id, invited_by) VALUES($1,$2, $3, $4) RETURNING *",
      [new Date(), req.body.userId, req.body.testId, req.body.invitedBy]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/start", (req, res) => {
  return req.db
    .any(
      "UPDATE test_attempts SET (started_at) = ($1) where id = $2 RETURNING *",
      [new Date(), req.body.testAttemptId]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/retrieveSavedProgress", (req, res) => {
  let count;
  return req.db
    .any(
      "SELECT started_at, reentered_count FROM test_attempts where id = $1 limit 1",
      [req.body.id]
    )
    .then(c => {
      console.log(c);
      count = c[0].reentered_count ? c[0].reentered_count + 1 : 1;
      if (req.body.review) {
        return Promise.resolve(true);
      } else {
        return req.db.any(
          "UPDATE test_attempts SET (reentered_count, last_reentered_at) = ($1,$2) where id = $3 RETURNING *",
          [count, new Date(), req.body.id]
        );
      }
    })
    .then(() => {
      return req.db.any(
        "SELECT candidate_answers FROM test_attempts where id = $1 limit 1",
        [req.body.id]
      );
    })
    .then(data => {
      return res.send(data);
    });
});

router.post("/saveProgress", (req, res) => {
  let { id, userId, candidateAnswers } = req.body;
  candidateAnswers = JSON.stringify(candidateAnswers);
  return req.db
    .any(
      "SELECT saved_progress_count FROM test_attempts where id = $1 limit 1",
      [id]
    )
    .then(data => {
      let newSavedProgressCount = data[0].saved_progress_count + 1;
      return req.db.any(
        "UPDATE test_attempts SET (candidate_answers, saved_progress_at,saved_progress_count) = ($1,$2,$3) where id = $4 RETURNING *",
        [candidateAnswers, new Date(), newSavedProgressCount, id]
      );
    })
    .then(attempt => {
      return res.send(attempt[0]);
    });
});

router.post("/submitTest", (req, res) => {
  let { candidateAnswers, id } = req.body;
  const util = require("util");

  // console.log(util.inspect(candidateAnswers, false, null));
  candidateAnswers = JSON.stringify(candidateAnswers);
  return req.db
    .any(
      "UPDATE test_attempts SET (candidate_answers) = ($1) where id = $2 RETURNING *",
      [candidateAnswers, id]
    )
    .then(() => {
      let results = [];
      let answers = JSON.parse(candidateAnswers);
      answers.forEach(q => {
        if (q.type === "multiple_choice") {
          let question = { id: q.id, type: q.type };
          question.correct =
            q.mc_candidate_answer === q.mc_answer ? true : false;
          // console.log(question.correct);
          q.correct = question.correct;
          results.push(question);
        } else if (q.type === "module" && q.module_type === "journal_entry") {
          let question = TestAttempts.checkJournalEntryAnswers(q);
          q.correct = question;
          results.push(question);
        } else if (q.type === "module" && q.module_type === "reconciliation") {
          let question = TestAttempts.checkReconciliationAnswers(q);
          q.correct = question;
          results.push(question);
        } else if (q.type === "module" && q.module_type === "multiple_choice") {
          let question = TestAttempts.checkMultipleChoiceModuleAnswers(q);
          q.correct = question;
          results.push(question);
        }
      });
      console.log("results ---->", results);
      results = TestAttempts.aggregateResults(results);
      return req.db.any(
        "UPDATE test_attempts SET (results, completed_at, candidate_answers) = ($1,$2,$3) where id = $4 RETURNING *",
        [JSON.stringify(results), new Date(), JSON.stringify(answers), id]
      );
    })
    .then(d => {
      return res.send(d);
    });
});
