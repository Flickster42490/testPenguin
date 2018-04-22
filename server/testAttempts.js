const router = require("express").Router();
const _ = require("lodash");

const TestAttempts = require("./testAttemptsDAO");
module.exports = router;

router.post("/create", (req, res) => {
  return req.db
    .any(
      "INSERT INTO test_attempts(invited_at, user_id, test_id) VALUES($1,$2, $3) RETURNING *",
      [new Date(), req.body.userId, req.body.testId]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/retrieveSavedProgress", (req, res) => {
  return req.db
    .any("SELECT candidate_answers FROM test_attempts where id = $1 limit 1", [
      req.body.id
    ])
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
      JSON.parse(candidateAnswers).forEach(q => {
        if (q.type === "multiple_choice") {
          let question = { id: q.id, type: q.type };
          question.correct =
            q.mc_candidate_answer === q.mc_answer ? true : false;
          // console.log(question.correct);
          results.push(question);
        } else if (q.type === "module" && q.module_type === "journal_entry") {
          let question = TestAttempts.checkJournalEntryAnswers(q);
          results.push(question);
        }
      });
      console.log("Test Results: ", results);
      return req.db.any(
        "UPDATE test_attempts SET (results, completed_at) = ($1,$2) where id = $3 RETURNING *",
        [JSON.stringify(results), new Date(), id]
      );
    })
    .then(d => {
      return res.send(d);
    });
});
