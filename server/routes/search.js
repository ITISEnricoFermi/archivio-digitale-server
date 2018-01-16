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
  Document
} = require("./../models/document");

router.post("/searchAdvancedDocuments", (req, res) => {

  var body = _.pick(req.body, ["name", "type", "faculty", "subject", "class", "section", "visibility"]);

  Document.searchAdvancedDocuments(body)
    .then((documents) => {
      res.status(200).send(documents);
    }).catch((e) => {
      res.status(401).send(e);
    });

});


module.exports = router;