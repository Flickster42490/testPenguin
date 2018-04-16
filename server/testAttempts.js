const router = require("express").Router();
module.exports = router;

router.post("/create", (req, res) => {
  return req.db
    .any(
      "INSERT INTO test_attempts(invited_at, user_id) VALUES($1,$2) RETURNING *",
      [Date.now(), req.body.id]
    )
    .then(data => {
      return res.send(data);
    });
});
