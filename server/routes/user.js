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
      res.status(400).send(e);
    });

});

module.exports = router;