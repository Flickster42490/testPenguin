const router = require("express").Router();
const _ = require("lodash");
module.exports = router;

const pageMap = {
  preBuiltTests: "pre_built",
  customTests: "custom"
};

router.post("/candidates", (req, res) => {
  let result = {};
  return req.db
    .any(
      `SELECT u.first_name, u.last_name FROM "test_attempts" as a 
  join "users" as u on a.user_id = u.id`
    )
    .then(users => {
      result.users = users.map(i => ({
        value: `${i.first_name} ${i.last_name}`,
        label: `${i.first_name} ${i.last_name}`
      }));
      return req.db
        .any(
          `SELECT distinct u.email_address FROM "test_attempts" as a 
        join "users" as u on a.user_id = u.id`
        )
        .then(emails => {
          result.emails = emails.map(i => ({
            value: i.email_address,
            label: i.email_address
          }));
          return res.send(result);
        });
    });
});

router.post("/tests", (req, res) => {
  let result = {};
  return req.db
    .any(`SELECT DISTINCT difficulty FROM questions`)
    .then(difficulty => {
      result.difficulty = difficulty.map(i => ({
        value: i.difficulty,
        label: i.difficulty
      }));
      return req.db.any(`SELECT tags FROM questions`);
    })
    .then(questionCategories => {
      let qCat = [];
      questionCategories.forEach(i => {
        if (i.tags) {
          let tags = i.tags.split(",");
          qCat = qCat.concat(tags);
        }
      });
      let filteredQCat = _.uniqBy(qCat);
      result.questionCategories = filteredQCat.map(i => ({
        value: i,
        label: i
      }));
      return req.db.any(
        `SELECT DISTINCT name FROM tests where created_by = $1`,
        [req.body.userId]
      );
    })
    .then(customTests => {
      result.customTests = customTests.map(i => ({
        value: i.name,
        label: i.name
      }));
      return req.db.any(
        `SELECT DISTINCT name FROM tests where type = 'pre_built'`
      );
    })
    .then(preBuiltTests => {
      result.preBuiltTests = preBuiltTests.map(i => ({
        value: i.name,
        label: i.name
      }));
      let page = pageMap[req.body.page];
      if (page === "custom") {
        return req.db.any(
          `SELECT tags FROM tests where type = $1 AND created_by = $2`,
          [page, req.body.userId]
        );
      } else {
        return req.db.any(`SELECT tags FROM tests where type = $1`, [page]);
      }
    })
    .then(testCategories => {
      let tCat = [];
      testCategories.forEach(i => {
        tCat = tCat.concat(i.tags);
      });
      console.log(testCategories, tCat);
      result.testCategories = tCat.map(i => ({
        value: i,
        label: i
      }));
      return res.send(result);
    });
});
