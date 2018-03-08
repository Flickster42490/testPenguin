var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");
const app = require("express")();

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
      callbackURL: "http://localhost:8000/auth/google/return",
      passReqToCallback: true
    },
    function(accessToken, refreshToken, _, profile, done) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      console.log("profile", profile, "!!!!!!!!!!", done);
      return done(null, profile);
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

module.exports = app;

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.get("/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/google/return",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/#/login"
  })
);
