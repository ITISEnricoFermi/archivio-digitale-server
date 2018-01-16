const cookieParser = require("cookie-parser");
const _ = require('lodash');

var {
  User
} = require("./../models/user");

var authenticate = (req, res, next) => {

  if (req.header("x-auth")) {
    var token = req.header("x-auth");
  } else {
    var token = req.cookies.token;
  }

  User.findByToken(token).then((user) => {

    if (!user) {
      return Promise.reject();
    }

    req.user = _.pick(user, ["_id", "firstname", "lastname", "email"]);
    req.token = token;
    next();

  }).catch((e) => {
    res.render("home");
  });
};

module.exports = {
  authenticate
};