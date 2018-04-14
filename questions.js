const router = require("express").Router();
module.exports = router;

router.get("/", (req, res) => {
  return req.db.any("SELECT * FROM questions").then(data => {
    console.log(data.length);
    return res.send(data);
  });
});
