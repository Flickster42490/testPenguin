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

router.post("/type/:type", (req, res) => {
  let filters = req.body.filters || undefined;
  return req.db
    .any("SELECT * FROM tests where type = $1", [req.params.type])
    .then(data => {
      let d = data;
      if (
        filters &&
        filters.preBuiltTests &&
        filters.preBuiltTests.length > 0
      ) {
        d = d.filter(i => {
          return filters.preBuiltTests.includes(i.name);
        });
      }
      if (filters && filters.testCategory && filters.testCategory !== "all") {
        d = d.filter(i => {
          if (i.tags) {
            return i.tags.includes(filters.testCategory);
          }
        });
      }
      return res.send(d);
    });
});

router.post("/type/:type/:id", (req, res) => {
  let filters = req.body.filters || undefined;
  return req.db
    .any("SELECT * FROM tests where type = $1 and created_by = $2", [
      req.params.type,
      req.params.id
    ])
    .then(data => {
      let d = data;
      if (filters && filters.customTests && filters.customTests.length > 0) {
        d = d.filter(i => {
          return filters.customTests.includes(i.name);
        });
      }
      if (filters && filters.testCategory && filters.testCategory !== "all") {
        d = d.filter(i => {
          if (i.tags) {
            return i.tags.includes(filters.testCategory);
          }
        });
      }
      return res.send(d);
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
      "INSERT INTO tests(name, description, created_at, created_by) VALUES($1,$2,$3,$4) RETURNING *",
      [req.body.name, req.body.description, new Date(), req.body.userId]
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

router.post("/issued", (req, res) => {
  let filters = req.body.filters || undefined;
  return req.db
    .any(
      "SELECT a.*, t.* FROM (SELECT count(test_id) as count, test_id FROM test_attempts where invited_by= $1GROUP BY test_id) a LEFT JOIN tests t ON a.test_id = t.id",
      [req.body.userId]
    )
    .then(data => {
      let d = data.filter(i => {
        if (i.type === "custom") {
          return i.created_by === req.body.userId;
        } else {
          return true;
        }
      });
      if (filters && filters.issuedTests && filters.issuedTests.length > 0) {
        d = d.filter(i => {
          return filters.issuedTests.includes(i.name);
        });
      }
      return res.send(d);
    });
});

router.post("/issued/:id", (req, res) => {
  return req.db
    .any(
      "SELECT a.*, t.* FROM (SELECT count(test_id) as count, test_id FROM test_attempts GROUP BY test_id) a LEFT JOIN tests t ON a.test_id = t.id where a.test_id = $1",
      [req.params.id]
    )
    .then(data => {
      return res.send(data);
    });
});
