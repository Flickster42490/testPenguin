const router = require("express").Router();
module.exports = router;

router.get("/", (req, res) => {
  return req.db.any("SELECT * FROM questions").then(data => {
    console.log("number of results: ", data.length);
    return res.send(data);
  });
});

router.get("/id/:questionId", (req, res) => {
  return req.db
    .any("SELECT * FROM questions where id = $1 limit 1", [
      req.params.questionId
    ])
    .then(data => {
      console.log(data.name);
      return res.send(data);
    });
});
