const router = require("express").Router();
const _ = require("lodash");
const moment = require("moment");
const TestAttempts = require("./testAttemptsDAO");
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

router.get("/:id", (req, res) => {
  return req.db
    .any(`SELECT * FROM "test_attempts" where id = $1`, [req.params.id])
    .then(d => {
      return res.send(d);
    });
});

router.get("/findOne/:id", (req, res) => {
  return req.db
    .any(
      `SELECT u.first_name, u.last_name, u.email_address, t.*, a.* FROM "test_attempts" as a 
    left join "users" as u on a.user_id = u.id 
    left join "tests" as t on t.id = a.test_id
    where a.id = $1`,
      [req.params.id]
    )
    .then(d => {
      console.log(d);
      return res.send(d);
    });
});

router.get("/issuedBy/:id", (req, res) => {
  return req.db
    .any(
      `SELECT count(*) as count FROM "test_attempts" where invited_by = $1`,
      [req.params.id]
    )
    .then(d => {
      console.log(d);
      return res.send(d);
    });
});

router.post("/sendReminder", (req, res) => {
  let {
    userId,
    candidateId,
    candidateEmail,
    testAttemptId,
    testId,
    expiringAt
  } = req.body;
  console.log(req.body);
  return req.db.any("SELECT * FROM users WHERE id=$1", [userId]).then(u => {
    let user = u[0];
    let msg = {
      to: candidateEmail,
      from: "admin@testpenguin.com",
      templateId: "66de2bfa-3df7-4845-b0e0-d577251ef584",
      substitutions: {
        user_first_name: user.first_name,
        user_last_name: user.last_name,
        company: user.company,
        user_email: user.email_address,
        expiration_date: moment(expiringAt).format("MM/DD/YYYY"),
        candidate_id: candidateId,
        test_attempt_id: testAttemptId,
        test_id: testId,
        base_url: "http://accounting-penguin.herokuapp.com"
      }
    };
    console.log(msg);
    sgMail
      .send(msg)
      .then(d => {
        //Celebrate
        console.log("celebrate. its sent");
        return req.db
          .any(
            "UPDATE test_attempts SET last_reminder_sent = $1 WHERE id = $2 RETURNING *",
            [req.body.lastReminderSent, testAttemptId]
          )
          .then(d => {
            return res.status(200).send(d);
          });
      })
      .catch(error => {
        //Log friendly error
        console.error(error.toString());

        //Extract error msg
        const { message, code, response } = error;

        //Extract response msg
        const { headers, body } = response;
      });
  });
});

router.post("/create", (req, res) => {
  console.log(req.body);
  let { userIds, expiringAt, testName } = req.body;
  let subQ = ``;
  let numberOfTests, dbUser, user, test;
  userIds.forEach((i, idx) => {
    if (idx !== userIds.length - 1)
      subQ =
        subQ +
        `($1, $${idx + 2}, '${req.body.testId}', '${
          req.body.invitedBy
        }', '${expiringAt}'),`;
    else
      subQ =
        subQ +
        `($1, $${idx + 2}, '${req.body.testId}', '${
          req.body.invitedBy
        }', '${expiringAt}')`;
  });
  let vars = [new Date()].concat(userIds);
  console.log("subQ and vars", subQ, vars);
  return req.db
    .any(
      `INSERT INTO test_attempts(invited_at, user_id, test_id, invited_by, expiring_at) VALUES ${subQ} RETURNING *`,
      vars
    )
    .then(data => {
      console.log(data);
      let candidates = data.map(i => i.user_id);
      return Promise.all([
        data,
        req.db.any(`SELECT * FROM users WHERE id = $1`, req.body.invitedBy),
        req.db.any("SELECT * FROM users WHERE id IN ($1:csv) ", [candidates])
      ]).then(all => {
        let attempts = all[0];
        user = all[1][0];
        let candidates = all[2];
        let emails = [];
        attempts.forEach(a => {
          let candidateInfo = _.find(candidates, { id: a.user_id });
          let tempMsg = {
            to: candidateInfo.email_address,
            from: "admin@testpenguin.com",
            templateId: "0dde1f97-fa38-47ad-997d-383b9ad7e7e4",
            substitutions: {
              user_first_name: user.first_name,
              user_last_name: user.last_name,
              company: user.company,
              user_email_address: user.email_address,
              test_expiration_date: moment(expiringAt).format("MM/DD/YYYY"),
              candidate_id: a.user_id,
              test_attempt_id: a.id,
              test_id: a.test_id,
              base_url: "http://accounting-penguin.herokuapp.com"
            }
          };
          emails.push(tempMsg);
        });
        numberOfTests = emails.length;
        sgMail
          .send(emails)
          .then(d => {
            //Celebrate
            console.log("celebrate. its sent", d);
            return req.db
              .any("SELECT * FROM users where id=$1", req.body.invitedBy)
              .then(user => {
                return req.db.any(
                  "UPDATE users SET tokens = $1 where id = $2",
                  [user[0].tokens - numberOfTests, user[0].id]
                );
              })
              .then(() => {
                let userMsg = {
                  to: user.email_address,
                  from: "admin@testpenguin.com",
                  templateId: "9bab0a1a-5644-46f1-b9aa-beda063080b2",
                  substitutions: {
                    user_first_name: user.first_name,
                    user_email: user.email_address,
                    expiration_date: moment(expiringAt).format("MM/DD/YYYY"),
                    invite_count: numberOfTests,
                    test_name: testName,
                    base_url: "http://accounting-penguin.herokuapp.com"
                  }
                };
                sgMail.send(userMsg).then(() => {
                  return res.send(true);
                });
              });
          })
          .catch(error => {
            //Log friendly error
            console.error(error.toString());

            //Extract error msg
            const { message, code, response } = error;

            //Extract response msg
            const { headers, body } = response;
          });
      });
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
        "SELECT candidate_answers,saved_progress_index,time_left FROM test_attempts where id = $1 limit 1",
        [req.body.id]
      );
    })
    .then(data => {
      return res.send(data);
    });
});

router.post("/saveProgress", (req, res) => {
  let {
    id,
    userId,
    candidateAnswers,
    timeLeft,
    savedProgressIndex,
    testSubmitted
  } = req.body;
  candidateAnswers = JSON.stringify(candidateAnswers);
  return req.db
    .any(
      "SELECT saved_progress_count FROM test_attempts where id = $1 limit 1",
      [id]
    )
    .then(data => {
      console.log(testSubmitted, "<---------------------- Test Submitted");
      if (!testSubmitted) {
        console.log(data);
        let newSavedProgressCount = data[0]
          ? data[0].saved_progress_count + 1
          : 1;
        return req.db.any(
          "UPDATE test_attempts SET (candidate_answers, saved_progress_at,saved_progress_count, saved_progress_index, time_left) = ($1,$2,$3,$4,$5) where id = $6 RETURNING *",
          [
            candidateAnswers,
            new Date(),
            newSavedProgressCount,
            savedProgressIndex,
            JSON.stringify(timeLeft),
            id
          ]
        );
      }
      return Promise.resolve([true]);
    })
    .then(attempt => {
      return res.send(attempt[0]);
    });
});

router.post("/submitTest", (req, res) => {
  let { candidateAnswers, id, timeLeft } = req.body;
  const util = require("util");
  let result, user, test, testAttempt, candidate;
  // console.log(util.inspect(candidateAnswers, false, null));
  return req.db
    .any(
      "UPDATE test_attempts SET (completed_at) = ($1) where id = $2 RETURNING *",
      [new Date(), id]
    )
    .then(a => {
      testAttempt = a[0];
      return req.db.any(
        `SELECT * FROM users WHERE id = $1 limit 1`,
        testAttempt.user_id
      );
    })
    .then(c => {
      candidate = c[0];
      return req.db.any(
        `SELECT * FROM users WHERE id = $1 limit 1`,
        testAttempt.invited_by
      );
    })
    .then(u => {
      user = u[0];
      let results = [];
      let answers = candidateAnswers;
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
        } else if (
          q.type === "module" &&
          q.module_type === "financial_statement"
        ) {
          let question = TestAttempts.checkReconciliationAnswers(q);
          q.correct = question;
          results.push(question);
        } else if (q.type === "module" && q.module_type === "multiple_choice") {
          let question = TestAttempts.checkMultipleChoiceModuleAnswers(q);
          q.correct = question;
          results.push(question);
        }
      });
      results = TestAttempts.aggregateResults(results);
      console.log(JSON.stringify(answers));
      return req.db.any(
        "UPDATE test_attempts SET (candidate_answers, results, completed_at, time_left) = ($1,$2,$3,$4) where id = $5 RETURNING *",
        [
          JSON.stringify(answers),
          JSON.stringify(results),
          new Date(),
          JSON.stringify(timeLeft),
          id
        ]
      );
    })
    .then(d => {
      result = d;
      let userMsg = {
        to: user.email_address,
        from: "admin@testpenguin.com",
        templateId: "1e886e06-9056-4ff3-830c-7bc6e78ad6c1",
        substitutions: {
          user_first_name: user.first_name,
          candidate_email: candidate.email_address,
          test_attempt_id: testAttempt.id,
          base_url: "http://accounting-penguin.herokuapp.com"
        }
      };
      sgMail.send(userMsg).then(() => {
        return res.send(result);
      });
    });
});
