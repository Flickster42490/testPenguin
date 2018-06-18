const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const router = require("express").Router();
const NodeCache = require("node-cache");
const Cache = new NodeCache({ stdTTL: 360000, checkperiod: 370000 });
const stripe = require("stripe")(process.env.STRIPE_KEY);
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var pgp = require("pg-promise")();
const cn = {
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true
};
console.log(cn);
var db = pgp(cn);

//local strategy
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username, password, "!!!!!!!!!!!!!!!!!!!!");
    return db
      .any("SELECT * FROM users WHERE email_address = $1", username)
      .then(user => {
        if (!user || user.length < 1) return done(null, false);
        if (user.length > 0 && user[0].password != password)
          return done(null, false);
        return done(null, user[0]);
      });
  })
);

// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "593977888768-6s7a1ngupthr5e8346nfqkknj0lue2ss.apps.googleusercontent.com",
      clientSecret: "jY2OkMQOWl8bE0Tbqyc9fIQq",
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      let user;
      console.log(profile);
      return db
        .any("SELECT * FROM users WHERE google_id = $1", profile.id)
        .then(user => {
          console.log("inside passport use, user: ", user);
          if (user.length > 0) {
            console.log("user.length > 0");
            return db
              .any(
                "UPDATE users set last_signed_in = $1 where id = $2 RETURNING *",
                [new Date(), user[0].id]
              )
              .then(u => {
                console.log(u);
                return Cache.get(profile.id, (err, value) => {
                  if (!err && !value) {
                    return Cache.set(profile.id, new Date(), (err, data) => {
                      console.log("err", err, "data", data);
                      return done(null, profile);
                    });
                  } else {
                    return done(null, profile);
                  }
                });
              });
          } else {
            return db
              .any(
                "INSERT INTO users(google_id,first_name,last_name,display_name,image_url, provider, email_address, last_signed_in, created_at,type,trial_end,tokens) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
                [
                  profile.id,
                  profile.name.givenName,
                  profile.name.familyName,
                  profile.displayName,
                  profile.photos[0] ? profile.photos[0].value : "",
                  profile.provider,
                  profile.emails[0] ? profile.emails[0].value : "",
                  new Date(),
                  new Date(),
                  "admin",
                  moment(new Date())
                    .endOf("day")
                    .add(7, "days"),
                  3
                ]
              )
              .then(u => {
                user = u[0];
                let userMsg = {
                  to: user.email_address,
                  from: "admin@testpenguin.com",
                  templateId: "bdd4a4e5-1c3a-464e-be08-4eb2aa3209f4",
                  substitutions: {
                    user_first_name: user.first_name,
                    base_url: "http://accounting-penguin.herokuapp.com"
                  }
                };
                sgMail.send(userMsg).then(() => {
                  return stripe.customers
                    .create({
                      email: user.email_address
                    })
                    .then(customer => {
                      console.log("stripe customer ---->", customer, user);
                      return db.any(
                        "UPDATE users SET stripe_id = $1 WHERE id=$2 RETURNING *",
                        [customer.id, user.id]
                      );
                    })
                    .then(u => {
                      return done(null, u);
                    });
                });
              });
          }
        })
        .catch(err => {
          console.log(err);
          return done(err);
        });
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: "86bdzivhtlsou0",
      clientSecret: "KOaIuLYNGbG1WKXY",
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["r_emailaddress", "r_basicprofile"]
    },
    function(accessToken, refreshToken, profile, done) {
      let user;
      console.log(profile);
      return db
        .any("SELECT * FROM users WHERE linkedin_id = $1", profile.id)
        .then(user => {
          console.log("inside passport use, user: ", user);
          if (user.length > 0) {
            console.log("user.length > 0");
            return db
              .any(
                "UPDATE users set last_signed_in = $1 where id = $2 RETURNING *",
                [new Date(), user[0].id]
              )
              .then(u => {
                console.log(u);
                return Cache.get(profile.id, (err, value) => {
                  if (!err && !value) {
                    return Cache.set(profile.id, new Date(), (err, data) => {
                      console.log("err", err, "data", data);
                      return done(null, profile);
                    });
                  } else {
                    return done(null, profile);
                  }
                });
              });
          } else {
            return db
              .any(
                "INSERT INTO users(linkedin_id,first_name,last_name,display_name,image_url, provider, email_address, last_signed_in, created_at,type,trial_end, tokens) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING * ",
                [
                  profile.id,
                  profile.name.givenName,
                  profile.name.familyName,
                  profile.displayName,
                  profile.photos[0] ? profile.photos[0].value : "",
                  profile.provider,
                  profile.emails[0] ? profile.emails[0].value : "",
                  new Date(),
                  new Date(),
                  "admin",
                  moment(new Date())
                    .endOf("day")
                    .add(7, "days"),
                  3
                ]
              )
              .then(u => {
                user = u[0];
                let userMsg = {
                  to: user.email_address,
                  from: "admin@testpenguin.com",
                  templateId: "bdd4a4e5-1c3a-464e-be08-4eb2aa3209f4",
                  substitutions: {
                    user_first_name: user.first_name,
                    base_url: "http://accounting-penguin.herokuapp.com"
                  }
                };
                sgMail.send(userMsg).then(() => {
                  return stripe.customers
                    .create({
                      email: user.email_address
                    })
                    .then(customer => {
                      console.log("stripe customer ---->", customer, user);
                      return db.any(
                        "UPDATE users SET stripe_id = $1 WHERE id=$2 RETURNING *",
                        [customer.id, user.id]
                      );
                    })
                    .then(u => {
                      return done(null, u);
                    });
                });
              });
          }
        })
        .catch(err => {
          console.log(err);
          return done(err);
        });
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = router;

router.use(cors());

router.post("/check", (req, res) => {
  if (req.body.userId) {
    Cache.get(req.body.userId, (err, value) => {
      console.log(err, value);
      if (!err) {
        if (value === undefined || value === "undefined") {
          console.log("cant get value, will redirect back to login ");
          return res.redirect(`/#/login`);
        } else {
          //"has it been more than one hour since last authenticated?" then remove cached and send user back to login screen
          console.log(
            "has it been more than one hour since last authenticated?",
            value.setHours(value.getHours() + 1) < new Date().getTime()
          );
          if (value.setHours(value.getHours() + 1) < new Date().getTime()) {
            console.log("in here for some reason");
            Cache.del(req.body.userId, (err, count) => {
              return res.status(401);
            });
          } else {
            console.log("all good auth check");
            return res.send(true);
          }
        }
      }
    });
  } else {
    return res.status(401);
  }
});

router.post("/logout", (req, res) => {
  console.log("userId", req.body.userId);
  if (req.body.userId) {
    Cache.del(req.body.userId, (err, count) => {
      console.log(err, count);
      return res.status(200).send(true);
    });
  } else {
    return res.status(500).send(false);
  }
});

router.post("/local", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  if (req.user) return res.send(req.user);
  if (!req.user) return res.status(401).send(false);
});

router.post("/local/register", (req, res) => {
  let user;
  const missing = [];
  if (!req.body.firstName) missing.push("First Name");
  if (!req.body.lastName) missing.push("Last Name");
  if (!req.body.username) missing.push("Username");
  if (!req.body.password) missing.push("Password");
  if (!req.body.company) missing.push("Company Name");
  if (missing.length > 0) return res.status(400).send({ missing: missing });
  return db
    .any("SELECT * FROM users where email_address = $1", req.body.username)
    .then(d => {
      if (d && d.length > 0) return res.status(400).send("found");
      else {
        return db
          .any(
            "INSERT INTO users(first_name, last_name, email_address, display_name, provider, last_signed_in, created_at, password, type, company, trial_end, tokens) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
            [
              req.body.firstName,
              req.body.lastName,
              req.body.username,
              `${req.body.firstName} ${req.body.lastName}`,
              "local",
              new Date(),
              new Date(),
              req.body.password,
              "admin",
              req.body.company,
              moment(req.body.currentDate)
                .endOf("day")
                .add(7, "days"),
              3
            ]
          )
          .then(u => {
            console.log("registered user ===> ", u[0]);
            user = u[0];
            let userMsg = {
              to: user.email_address,
              from: "admin@testpenguin.com",
              templateId: "bdd4a4e5-1c3a-464e-be08-4eb2aa3209f4",
              substitutions: {
                user_first_name: user.first_name,
                base_url: "http://accounting-penguin.herokuapp.com"
              }
            };
            sgMail.send(userMsg).then(() => {
              console.log("registered user ===> ", user);
              return stripe.customers
                .create({
                  email: user.email_address
                })
                .then(customer => {
                  console.log("stripe customer ---->", customer, user);
                  return db
                    .any(
                      "UPDATE users SET stripe_id = $1 WHERE id=$2 RETURNING *",
                      [customer.id, u[0].id]
                    )
                    .then(u => {
                      console.log(u[0]);
                      if (u && u.length > 0) return res.send(u[0]);
                      else return res.status(401).send(false);
                    });
                });
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(401).send(false);
    });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/linkedin", passport.authenticate("linkedin"));

router.get("/google/return", (req, res) =>
  passport.authenticate("google", (err, user, info) => {
    console.log("err: ", err, "user: ", user, "info : ", info);
    if (err) {
      return res.status(400).json(err);
    }
    if (user) {
      return db
        .any("SELECT * FROM users WHERE google_id = $1", user.id)
        .then(user => {
          return res.redirect(
            `/#/dashboard/candidates?id=${encodeURIComponent(user[0].id)}`
          );
        });
    }
  })(req, res)
);

router.get("/linkedin/return", (req, res) =>
  passport.authenticate("linkedin", (err, user, info) => {
    console.log("err: ", err, "user: ", user, "info : ", info);
    if (err) {
      return res.status(400).json(err);
    }
    if (user) {
      return db
        .any("SELECT * FROM users WHERE linkedin_id = $1", user.id)
        .then(user => {
          return res.redirect(
            `/#/dashboard/candidates?id=${encodeURIComponent(user[0].id)}`
          );
        });
    }
  })(req, res)
);
