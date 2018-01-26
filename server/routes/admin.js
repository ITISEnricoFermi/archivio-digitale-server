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

router.post("/getRequests", (req, res) => {

  User.find({
      state: "pending"
    })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

router.post("/acceptRequestById", (req, res) => {

  let id = req.body._id;

  User.findById(id)
    .then((user) => {
      user.state = "active";
      return user.save();
    })
    .then(() => {
      res.status(200).send("Richiesta d'iscrizione accettata.");
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

router.post("/refuseRequestById", (req, res) => {

  let id = req.body._id;

  User.findByIdAndRemove(id)
    .then(() => {
      res.status(200).send("Richiesta d'iscrizione rifiutata.");
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

module.exports = router;