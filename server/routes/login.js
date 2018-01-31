const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const validator = require('validator');

// Models
const {
  User
} = require("./../models/user");


//GET
router.get("/", (req, res) => {
  res.render("login", {
    pageTitle: "Archivio Digitale - ITIS Enrico Fermi"
  });
});

// POST
router.post("/", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send("Email non valida.");
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send("Password non valida o troppo breve. (min. 6).");
  }

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.cookie("token", token)
        .header("x-auth", token)
        .send(token);
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

module.exports = router;