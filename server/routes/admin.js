const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");

// Middleware
const {
  authenticate
} = require("./../middleware/authenticate");

// Models
const {
  User
} = require("./../models/user");

router.post("/createUser", (req, res) => {
  console.log(req.body);
  var body = _.pick(req.body, ["firstname", "lastname", "email", "password", "privileges"]);
  var user = new User(body);

  user.save().then((user) => {
    res.status(200).send(user);
  }).catch((e) => {
    res.status(401).send(e);
  });

});

router.post("/getUsers", (req, res) => {

  User.findUser(req.body.key).then((users) => {
    res.status(200).send(users);
  }).catch((e) => {
    res.status(401).send(e);
  });

});

module.exports = router;