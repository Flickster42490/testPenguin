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

router.post("/saveProgress", (req, res) => {
  req.body.userId = "1";
  req.body.candidateAnswer = {};
  return req.db
    .any(
      "SELECT saved_progress_count FROM test_attempts where user_id = $1 limit 1",
      [req.body.userId]
    )
    .then(data => {
      let newSavedProgressCount = data[0].saved_progress_count + 1;
      return req.db.any(
        "INSERT INTO test_attempts(user_id, saved_progress,saved_progress_at,saved_progress_count) VALUES($1,$2,$3,$4) RETURNING *",
        [
          req.body.userId,
          req.body.candidateAnswer,
          new Date(),
          newSavedProgressCount
        ]
      );
    })
    .then(attempt => {
      return res.send(attempt[0]);
    });
});
