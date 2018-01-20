const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const validator = require('validator');

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

  if (validator.isEmpty(body.firstname) || !validator.isAlpha(body.firstname)) {
    return res.status(400).send("Nome non valido.");
  } else if (validator.isEmpty(body.lastname) || !validator.isAlpha(body.lastname)) {
    return res.status(400).send("Cognome non valido");
  } else if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send("Email non valida.");
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send("Password non valida o troppo breve. (min. 6).");
  }


  user.save()
    .then((user) => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header("x-auth", token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
      console.log(e);
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