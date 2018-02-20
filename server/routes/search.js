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

const {
  DocumentCollection
} = require("./../models/document_collection");

router.post("/searchDocuments", authenticate, (req, res) => {

  var body = _.pick(req.body, ["fulltext", "type", "faculty", "subject", "class", "section", "visibility"]);

  Document.searchDocuments(body, req.user)
    .then((documents) => {

      res.status(200)
        .header("x-userid", req.user._id)
        .header("x-userprivileges", req.user.privileges)
        .send(documents);
    }).catch((e) => {
      res.status(500).send("Errore: " + e);
      console.log(e);
    });

});

router.post("/searchCollections", authenticate, (req, res) => {

  var body = _.pick(req.body, ["fulltext", "permissions"]);

  console.log(body);

  DocumentCollection.searchCollections(body)
    .then((collections) => {

      res.status(200)
        .header("x-userid", req.user._id)
        .header("x-userprivileges", req.user.privileges)
        .send(collections);
    }).catch((e) => {
      res.status(500).send("Errore: " + e);
      console.log(e);
    });

});

router.post("/getDocumentById/", (req, res) => {

  Document.findDocumentById(req.body._id)
    .then((document) => {
      res.status(200).send(document);
    }).catch((e) => {
      res.status(401).send(e);
    });

});

router.post("/removeDocumentById", authenticate, (req, res) => {
  Document.findDocumentById(req.body._id)
    .then((document) => {

      if (document.author._id !== req.user._id && req.user.privileges !== "admin") {
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