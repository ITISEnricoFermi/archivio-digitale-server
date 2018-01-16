const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

// Models
const {
  User
} = require("./../models/user");

const {
  Request
} = require("./../models/request");

//GET
router.get("/", (req, res) => {
  res.render("signup", {
    pageTitle: "Archivio Digitale - ITIS Enrico Fermi"
  });
});

// POST
router.post("/", (req, res) => {

  var body = _.pick(req.body, ["firstname", "lastname", "email", "password"]);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header("x-auth", token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });

});

router.post("/addRequest", (req, res) => {
  var id = req.body._id;
  Request.addRequest(id)
    .then((request) => {
      res.status(200).send(request);
    }).catch((e) => {
      res.status(400).send(e);
    });
});


module.exports = router;