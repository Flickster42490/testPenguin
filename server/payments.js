const router = require("express").Router();
const _ = require("lodash");
const stripe = require("stripe")(process.env.STRIPE_KEY);
// const Promise = require("bluebird");

module.exports = router;
router.post("/purchase", (req, res) => {
  let dbUser, stripeCustomer;
  return req.db
    .any("SELECT * FROM users WHERE id=$1", req.body.userId)
    .then(user => {
      dbUser = user ? user[0] : undefined;
      if (user && user.length > 0 && user[0].stripe_id) {
        return Promise.all([stripe.customers.retrieve(user[0].stripe_id), {}]);
      } else {
        return stripe.customers
          .create({
            email: user[0].email_address
          })
          .then(customer => {
            return Promise.all([
              customer,
              req.db.any("UPDATE users SET stripe_id=$1 where id=$2", [
                customer.id,
                user[0].id
              ])
            ]);
          });
      }
    })
    .then(customer => {
      stripeCustomer = customer[0];
      console.log("customer --->", customer[0]);
      return stripe.customers.createSource(stripeCustomer.id, {
        source: req.body.token.id
      });
    })
    .then(src => {
      console.log(
        "src ---->",
        src,
        stripeCustomer.id,
        src.id,
        dbUser.email_address
      );
      return stripe.charges.create({
        amount: req.body.purchaseAmount,
        currency: "usd",
        customer: stripeCustomer.id,
        source: src.id,
        receipt_email: dbUser.email_address
      });
    })
    .then(charge => {
      console.log("dbUser ------->", dbUser, charge);
      if (charge) {
        return Promise.all([
          charge,
          req.db.any(
            `UPDATE users SET (tokens,trial) = ($1,$2) where id = $3`,
            [dbUser.tokens + req.body.tokenAmount, false, dbUser.id]
          )
        ]);
      }
    })
    .then(result => {
      console.log("charge ------->", result[0]);
      if (result[0]) {
        return res.send(result[0]);
      }
      // New charge created on a new customer
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send(new Error(err));
      // Deal with an error
    });
});
