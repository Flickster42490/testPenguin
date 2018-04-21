const router = require("express").Router();
module.exports = router;

router.post("/candidate/invite", (req, res) => {
  const { firstName, lastName, email } = req.body;
  return req.db //create user
    .any(
      "INSERT INTO users(first_name, last_name, email_address, type) VALUES($1,$2,$3, 'candidate') RETURNING *",
      [firstName, lastName, email]
    )
    .then(data => {
      return res.send(data);
      //integrate with Mailgun and send out an email template with link to our app.
    })
    .catch(err => {
      console.log("err", err);
    });
});
