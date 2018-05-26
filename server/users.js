const router = require("express").Router();
const _ = require("lodash");
module.exports = router;

router.post("/candidate/invite", (req, res) => {
  let { emails } = req.body;
  emails = emails.split(",");
  let existingUsers = [],
    newUserEmails = [];
  return req.db
    .task(t => {
      let queries = [];
      emails.forEach(i => {
        queries.push(
          t.any("SELECT * FROM users where email_address = $1", i.trim())
        );
      });
      return t.batch(queries);
    })
    .then(b => {
      console.log("batchresults existing users--->", b);
      emails.forEach(e => {
        let batchedResult = false;
        let existingUser;
        b.forEach(r => {
          if (r.length > 0 && e.trim() === r[0].email_address) {
            batchedResult = true;
            existingUser = r[0];
          }
        });
        if (batchedResult) existingUsers.push(existingUser);
        else newUserEmails.push(e);
      });
      //if no newUserEmails
      if (newUserEmails.length === 0) {
        return res.send(existingUsers);
      } else {
        //if there are some newUserEmails
        let subQ = ``;
        newUserEmails.forEach((i, idx) => {
          if (idx !== newUserEmails.length - 1)
            subQ = subQ + `($${idx + 2}, 'candidate', $1),`;
          else subQ = subQ + `($${idx + 2}, 'candidate', $1)`;
        });
        let vars = [new Date()].concat(newUserEmails);
        console.log("subQ and vars", subQ, vars);
        return req.db //create users
          .any(
            `INSERT INTO users(email_address, type, created_at) VALUES ${subQ} RETURNING *`,
            vars
          )
          .then(newUsers => {
            console.log("newUsers", newUsers);
            let allUsers = newUsers.concat(existingUsers);
            return res.send(allUsers);
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    })
    .catch(err => {
      console.log("batched error ---->", err);
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
