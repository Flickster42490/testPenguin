var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");
const router = require("express").Router();
const NodeCache = require("node-cache");
const Cache = new NodeCache({ stdTTL: 360000, checkperiod: 370000 });

var pgp = require("pg-promise")();
const cn = {
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};
console.log(cn);
var db = pgp(cn);

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
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
      return db
        .any("SELECT * FROM users WHERE google_id = $1", profile.id)
        .then(user => {
          if (user.length > 0) {
            Cache.get(profile.id, (err, value) => {
              if (!err && !value) {
                return Cache.set(profile.id, new Date(), (err, data) => {
                  console.log("err", err, "data", data);
                  return done(null, profile);
                });
              } else {
                return done(null, profile);
              }
            });
          } else {
            return db
              .any(
                "INSERT INTO users(google_id,first_name,last_name,display_name,image_url, provider, email_address) VALUES($1,$2,$3,$4,$5,$6,$7)",
                [
                  profile.id,
                  profile.name.givenName,
                  profile.name.familyName,
                  profile.displayName,
                  profile.photos[0] ? profile.photos[0].value : "",
                  profile.provider,
                  profile.emails[0] ? profile.emails[0].value : ""
                ]
              )
              .then(() => {
                return Cache.set(profile.id, new Date(), (err, data) => {
                  console.log("err", err, "data", data);
                  return done(null, profile);
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
        if (value === undefined) {
          return res.redirect(`/#/login`);
        } else {
          //"has it been more than one hour since last authenticated?" then remove cached and send user back to login screen
          console.log(
            "has it been more than one hour since last authenticated?",
            value.setHours(value.getHours() + 1) < new Date().getTime()
          );
          if (!value.setHours(value.getHours() + 1) < new Date().getTime()) {
            Cache.del(req.body.userId, (err, count) => {
              return res.status(401);
            });
          } else {
            return res.send(true);
          }
        }
      }
    });
  } else {
    return res.status(401);
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/return", (req, res) =>
  passport.authenticate("google", (err, user, info) => {
    console.log("err: ", err, "user: ", user, "info : ", info);
    if (err) {
      return res.status(400).json(err);
    }
    if (user) {
      return res.redirect(
        `/#/dashboard/candidates?id=${encodeURIComponent(user.id)}`
      );
    }
  })(req, res)
);
