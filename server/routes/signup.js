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
  Subject
} = require("./../models/subject");


router.put("/", (req, res) => {

  var body = _.pick(req.body, ["firstname", "lastname", "email", "password", "accesses"]);
  var user = new User(body);

  if (validator.isEmpty(body.firstname) || !validator.isAlpha(body.firstname)) {
    return res.status(400).send("Nome non valido.");
  } else if (validator.isEmpty(body.lastname) || !validator.isAlpha(body.lastname)) {
    return res.status(400).send("Cognome non valido");
  } else if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send("Email non valida.");
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send("Password non valida o troppo breve. (min. 6).");
  } else if (body.accesses.length === 0) {
    return res.status(400).send("Inserire delle autorizzazioni.");
  }

  let orQuery = {
    $or: []
  };

  for (let i = 0; i < body.accesses.length; i++) {
    orQuery.$or.push({
      _id: body.accesses[i]._id
    });
  }

  return Subject.find(orQuery)
    .count()
    .then((subjects) => {
      if (subjects !== body.accesses.length) {
        return res.status(400).send("Una delle autorizzazioni non è valida.");
      }

      return User.findOne({
          email: body.email
        })
        .then((dbUser) => {
          if (dbUser) {
            return res.status(400).send("Utente già registrato.");
          }

          return user.save()
            .then((user) => {
              return user.generateAuthToken();
            }).then((token) => {
              res.header("x-auth", token).send(user);
            });

        })
        .catch((e) => {
          return res.status(500).send(e);
        });

    })
    .catch((e) => {
      return res.status(500).send("Errore nel reperire le autorizzazioni.");
    });

});

module.exports = router;