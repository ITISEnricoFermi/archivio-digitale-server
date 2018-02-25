const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");
const validator = require('validator');

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require("./../middleware/authenticate");

// Models
const {
  User
} = require("./../models/user");

router.post("/createUser", authenticate, authenticateAdmin, (req, res) => {

  var body = _.pick(req.body, ["firstname", "lastname", "email", "password", "privileges", "accesses"]);
  var user = new User(body);

  if (validator.isEmpty(body.firstname) || !validator.isAlpha(body.firstname)) {
    return res.status(400).send("Nome non valido.");
  } else if (validator.isEmpty(body.lastname) || !validator.isAlpha(body.lastname)) {
    return res.status(400).send("Cognome non valido");
  } else if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send("Email non valida.");
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send("Password non valida o troppo breve. (min. 6).");
  } else if (validator.isEmpty(body.privileges) || !validator.isAlpha(body.privileges)) {
    return res.status(400).send("Privilegi non validi.");
  } else if (body.accesses.length === 0) {
    return res.status(400).send("Specificare i permessi dell'utente. (min. 1).");
  }

  user.state = "active";

  user.save()
    .then((user) => {
      res.status(200).send(user);
    }).catch((e) => {
      res.status(401).send(e);
    });

});

router.post("/getUsers", authenticate, authenticateAdmin, (req, res) => {

  User.findUser(req.body.key)
    .then((users) => {
      res.status(200).send(users);
    }).catch((e) => {
      res.status(401).send(e);
    });

});

router.post("/getRequests", authenticate, authenticateAdmin, (req, res) => {

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

router.post("/acceptRequestById", authenticate, authenticateAdmin, (req, res) => {

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

router.post("/refuseRequestById", authenticate, authenticateAdmin, (req, res) => {

  let id = req.body._id;

  User.findByIdAndRemove(id)
    .then(() => {
      res.status(200).send("Richiesta d'iscrizione rifiutata.");
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

router.post("/resetPassword", authenticate, authenticateAdmin, (req, res) => {
  let id = req.body._id;
});

router.post("/togglePrivileges", (req, res) => {
  let id = req.body._id;
  User.findById(id)
    .then((user) => {
      if (user.privileges === "admin") {
        user.privileges = "user";
      } else {
        user.privileges = "admin";
      }

      return user.save();
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/toggleState", authenticate, authenticateAdmin, (req, res) => {

  let id = req.body._id;
  User.findById(id)
    .then((user) => {
      if (user.state === "active") {
        user.state = "disabled";
      } else {
        user.state = "active";
      }

      return user.save();
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((e) => {
      res.status(400).send();
    });

});

module.exports = router;