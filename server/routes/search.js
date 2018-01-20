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

router.post("/searchDocuments", (req, res) => {

  var body = _.pick(req.body, ["name", "type", "faculty", "subject", "class", "section", "visibility"]);

  Document.searchDocuments(body)
    .then((documents) => {
      res.status(200).send(documents);
    }).catch((e) => {
      res.status(401).send(e);
    });

});

router.post("/getDocumentById/", (req, res) => {

  Document.findDocumentById(req.body._id).then((document) => {
    res.status(200).send(document);
  }).catch((e) => {
    res.status(401).send(e);
  });

});

router.post("/removeDocumentById", authenticate, (req, res) => {
  Document.findDocumentById(req.body._id).then((document) => {
    if (document.author != req.user._id && req.user.privileges != "admin") {
      return res.status(401).send("Non si detengono le autorizzazioni per eliminare il documento.");
    }

    Document.remove({
        _id: req.body._id
      })
      .then(() => {
        res.status(200).send("Documento eliminato correttamente.");
      })
      .catch((e) => {
        res.status(400).send(e);
      })
  })
});


module.exports = router;