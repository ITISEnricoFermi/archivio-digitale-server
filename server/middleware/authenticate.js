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

    req.user = _.pick(user, ["_id", "firstname", "lastname", "email", "privileges"]);
    req.token = token;
    next();

  }).catch((e) => {
    console.log("Url:", req.url);
    if (req.url === "/") {
      return res.render("home");
    }

    res.redirect("/login");
  });
};

var authenticateAdmin = (req, res, next) => {

  var id = req.user._id;

  if (!req.user) {
    return Promise.reject();
  }

  return User.findById(id)
    .then((user) => {
      var privileges = user.privileges;

      if (privileges != "admin") {
        return Promise.reject("L'utente non è un admin.");
      }

      next();

    }).catch((e) => {
      return Promise.reject(e);
    });
};

var authenticateUser = (req, res, next) => {

  var userId = req.user._id;
  var id = req.body._id;

  if (userId != id) {
    return Promise.reject("L'utente non detiene i privilegi necessari.");
  }

  next();

};

var authenticateAcesses = (req, res, next) => {

};

module.exports = {
  authenticate,
  authenticateAdmin
};