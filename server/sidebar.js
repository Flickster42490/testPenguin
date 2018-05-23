const router = require("express").Router();
module.exports = router;

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
