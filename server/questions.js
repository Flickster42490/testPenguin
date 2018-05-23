const router = require("express").Router();
module.exports = router;

router.post("/", (req, res) => {
  const filters = req.body.filters || undefined;
  return req.db.any("SELECT * FROM questions").then(data => {
    d = data;
    console.log(filters);
    if (
      filters &&
      filters.questionCategory &&
      filters.questionCategory !== "all"
    ) {
      d = d.filter(i => {
        if (i.tags) {
          return i.tags.includes(filters.questionCategory.trim());
        }
      });
    }
    if (filters && filters.difficulty && filters.difficulty.length > 0) {
      d = d.filter(i => {
        return filters.difficulty.includes(i.difficulty);
      });
    }
    return res.send(d);
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
