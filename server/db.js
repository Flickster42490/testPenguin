var pgp = require("pg-promise")();
const cn = {
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true
};
const db = pgp(cn);

module.exports = () =>
  function(req, res, next) {
    req.db = db;
    next();
  };
