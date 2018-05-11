const router = require("express").Router();
module.exports = router;

router.get("/", (req, res) => {
  return req.db.any("SELECT * FROM tests").then(data => {
    console.log("number of results: ", data.length);
    return res.send(data);
  });
});

router.get("/:id", (req, res) => {
  return req.db
    .any("SELECT * FROM tests where id = $1", [req.params.id])
    .then(data => {
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

router.get("/id/:id/questions", (req, res) => {
  return req.db
    .any("SELECT * FROM tests where id = $1", [req.params.id])
    .then(data => {
      const questionList = data[0].question_ids;
      var questionListString = "{";
      questionList.forEach((i, idx, array) => {
        if (idx === array.length - 1) {
          questionListString = questionListString + i + "}";
        } else {
          questionListString = questionListString + i + ",";
        }
      });
      return req.db
        .any(
          "SELECT * FROM questions where id = ANY($1::int[]) ORDER BY id",
          questionListString
        )
        .then(q => {
          console.log(q);
          return res.send(q);
        });
    });
});

router.post("/create/testBasics", (req, res) => {
  return req.db
    .any(
      "INSERT INTO tests(name, description, created_at) VALUES($1,$2,$3) RETURNING *",
      [req.body.name, req.body.description, new Date()]
    )
    .then(data => {
      return res.send(data);
    });
});

router.post("/create/addQuestions/:id", (req, res) => {
  return req.db
    .any(
      "UPDATE tests set (question_ids,tags,question_types,estimated_time,type,question_details) = ($1,$2,$3,$4,$5,$6) where id = $7 RETURNING *",
      [
        JSON.stringify(req.body.questions),
        JSON.stringify(req.body.tags),
        JSON.stringify(req.body.types),
        req.body.estimatedTime,
        "custom",
        JSON.stringify(req.body.questionDetails),
        req.params.id
      ]
    )
    .then(data => {
      console.log(data);
      return res.send(data);
    });
});
