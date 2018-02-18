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
  Document
} = require("./../models/document");

router.post("/me/", authenticate, (req, res) => {

  var body = _.pick(req.user, ["_id", "firstname", "lastname", "email", "accesses", "privileges", "img"]);
  Document.count({
      author: body._id
    })
    .then((documents) => {
      body.documents = documents;
      res.status(200).send(body);
    })
    .catch((e) => {
      res.status(500).send(e);
    });

});

router.post("/me/documents", authenticate, (req, res) => {
  var body = _.pick(req.body, ["visibility"]);

  Document.find({
      author: req.user._id,
      visibility: body.visibility
    })
    .sort({
      _id: 1
    })
    .then((documents) => {
      res.status(200).send(documents);
    })
    .catch((e) => {
      res.status(500).send(e);
    });

});

router.post("/me/logged", authenticate, (req, res) => {
  res.status(200).send();
});

module.exports = router;