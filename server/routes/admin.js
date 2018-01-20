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

const {
  Request
} = require("./../models/request");

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

router.post("/getRequests", (req, res) => {

  Request.getRequests()
    .then((requests) => {
      res.status(200).send(requests);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/acceptRequestById", (req, res) => {

  Request.acceptRequestById(req.body._id)
    .then((request) => {
      res.status(200).send(request);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

module.exports = router;