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

  User.findByToken(token)
    .then((user) => {

      if (!user) {
        return Promise.reject();
      }

      req.user = _.pick(user, ["_id", "firstname", "lastname", "email", "privileges", "accesses", "img"]);
      req.token = token;
      next();

    }).catch((e) => {
      if (req.url === "/") {
        return res.render("home");
      }

      // res.redirect("/login");

      res.status(401).send();

    });
};

var authenticateAdmin = (req, res, next) => {

  if (req.user.privileges !== "admin") {
    return res.status(401).send("Non si detengono i privilegi necessari.");
  }

  next();

};

var authenticateUser = (req, res, next) => {

  var userId = req.user._id;
  var id = req.body._id;

  if (userId != id) {
    return Promise.reject("L'utente non detiene i privilegi necessari.");
  }

  next();

};

var authenticateAccesses = (req, res, next) => {

  let query;

  if (req.user.privileges === "admin") {
    query = {};
  } else {
    query = {
      subject: { // <=====
        $in: req.user.accesses
      }
    };
  }

  req.query = query;

  next();

};

module.exports = {
  authenticate,
  authenticateAdmin,
  authenticateAccesses
};