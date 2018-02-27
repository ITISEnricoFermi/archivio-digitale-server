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

router.get("/info/:id", authenticate, (req, res) => {

  let body = _.pick(req.params, ["id"]);

  DocumentCollection.findById(body.id)
    .then((collection) => {
      res.status(200).send(collection)
    })
    .catch((e) => {
      res.status(500).send("Errore nel reperire la collezione.");
    });

});

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


router.delete("/:id", authenticate, (req, res) => {

  DocumentCollection.findById(req.params.id)
    .then((collection) => {

      if (collection.author._id !== req.user._id && req.user.privileges !== "admin") {
        return res.status(401).send("Non si detengono le autorizzazioni per eliminare la collezione.");
      }

      return DocumentCollection.remove({
          _id: req.params.id
        })
        .then(() => {
          res.status(200).send("Collezione eliminata correttamente.");
        });
    })
    .catch((e) => {
      res.status(500).send(e);
    })
});

router.post("/search/", authenticate, (req, res) => {

  var body = _.pick(req.body, ["fulltext", "permissions"]);

  DocumentCollection.searchCollections(body)
    .then((collections) => {
      res.status(200)
        .header("x-userid", req.user._id)
        .header("x-userprivileges", req.user.privileges)
        .send(collections);
    })
    .catch((e) => {
      res.status(500).send("Errore nel cercare le collezioni.");
    });

});

module.exports = router;