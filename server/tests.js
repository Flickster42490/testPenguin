const router = require("express").Router();
module.exports = router;

router.get("/", (req, res) => {
  return req.db.any("SELECT * FROM tests").then(data => {
    console.log("number of results: ", data.length);
    return res.send(data);
  });
});

router.get("/type/:type", (req, res) => {
  return req.db
    .any("SELECT * FROM tests where type = $1", [req.params.type])
    .then(data => {
      return res.send(data);
    });
});
