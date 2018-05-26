const router = require("express").Router();
module.exports = router;

router.post("/candidate/invite", (req, res) => {
  let { emails } = req.body;
  emails = emails.split(",");
  let subQ = ``;
  emails.forEach((i, idx) => {
    if (idx !== emails.length - 1)
      subQ = subQ + `($${idx + 2}, 'candidate', $1),`;
    else subQ = subQ + `($${idx + 2}, 'candidate', $1)`;
  });
  let vars = [new Date()].concat(emails);
  console.log(subQ, vars);
  return req.db //create users
    .any(
      `INSERT INTO users(email_address, type, created_at) VALUES ${subQ} RETURNING *`,
      vars
    )
    .then(data => {
      console.log(data);
      return res.send(data);
      //integrate with Mailgun and send out an email template with link to our app.
    })
    .catch(err => {
      console.log("err", err);
    });
});

router.post("/candidate/update", (req, res) => {
  return req.db
    .any(`UPDATE users SET(first_name, last_name) = ($1, $2) where id = $3`, [
      req.body.firstName,
      req.body.lastName,
      req.body.userId
    ])
    .then(data => {
      return res.send(data);
    })
    .catch(err => {
      console.log("err", err);
    });
});

router.get("/:id", (req, res) => {
  return req.db
    .any("SELECT * FROM users where id = $1", [req.params.id])
    .then(data => {
      return res.send(data);
    });
});
