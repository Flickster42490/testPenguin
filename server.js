const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
var passport = require("passport");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
// app.use(db());
_registerRoutes(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8000);

function _registerRoutes(app) {
  app.use("/auth", require("./auth"));
  // app.use("/graphql", require("./graphql"));
  // app.use("/info", require("./version"));
  // app.use("/", require("./version"));
  // app.use(require("./rest"));
}
