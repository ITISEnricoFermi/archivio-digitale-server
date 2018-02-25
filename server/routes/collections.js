const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require("./../middleware/authenticate");

// Models
const {
  DocumentCollection
} = require("./../models/document_collection");



router.put("/", authenticate, (req, res) => {

  let body = _.pick(req.body, ["documentCollection", "permissions", "authorizations"]);
  let user = req.user;

  if (validator.isEmpty(body.documentCollection)) {
    return res.status(400).send("Nome della collezione non valida.");
  }

  body.author = user._id;

  let collection = new DocumentCollection(body);

  collection.save()
    .then((collection) => {
      res.status(201).send("Collezione creata con successo.");
    })
    .catch((e) => {
      res.status(500).send(e);
    });


});

module.exports = router;