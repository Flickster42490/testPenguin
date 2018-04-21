const router = require("express").Router();
module.exports = router;

router.post("/create", (req, res) => {
  return req.db
    .any(
      "INSERT INTO test_attempts(invited_at, user_id) VALUES($1,$2) RETURNING *",
      [new Date(), req.body.userId]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/retrieveSavedProgress", (req, res) => {
  return req.db
    .any(
      "SELECT candidate_answers FROM test_attempts where user_id = $1 limit 1",
      [req.body.userId]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/saveProgress", (req, res) => {
  let { userId, candidateAnswer } = req.body;
  candidateAnswer = JSON.stringify(candidateAnswer);
  return req.db
    .any(
      "SELECT saved_progress_count FROM test_attempts where user_id = $1 limit 1",
      [userId]
    )
    .then(data => {
      let newSavedProgressCount = data[0].saved_progress_count + 1;
      return req.db.any(
        "UPDATE test_attempts SET (user_id, candidate_answers, saved_progress_at,saved_progress_count) = ($1,$2,$3,$4) RETURNING *",
        [userId, candidateAnswer, new Date(), newSavedProgressCount]
      );
    })
    .then(attempt => {
      return res.send(attempt[0]);
    });
});
