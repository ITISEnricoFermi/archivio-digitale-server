const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");
const multer = require('multer');
const validator = require('validator');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/documents");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage
});

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require("./../middleware/authenticate");

// Models
const {
  Document
} = require("./../models/document");

router.post("/documentUpload", authenticate, upload.single("fileToUpload"), (req, res) => {

  let file = req.file;

  let body = _.pick(JSON.parse(req.body.document), ["name", "type", "faculty", "subject", "class", "section", "visibility", "description"]);
  let user = req.user;

  if (validator.isEmpty(body.name)) {
    return res.status(400).send("Nome non valido.");
  } else if (validator.isEmpty(body.type)) {
    return res.status(400).send("Tipo non valido.");
  } else if (validator.isEmpty(body.faculty) || !validator.isAlpha(body.faculty)) {
    return res.status(400).send("Specializzazione non valida.");
  } else if (validator.isEmpty(body.subject) || !validator.isAlpha(body.subject)) {
    return res.status(400).send("Materia non valida.");
  } else if (!validator.isInt(body.class)) {
    return res.status(400).send("Classe non valida.");
  } else if (!validator.isAlpha(body.section)) {
    return res.status(400).send("Sezione non valida");
  } else if (validator.isEmpty(body.visibility) || !validator.isAlpha(body.visibility)) {
    return res.status(400).send("Visibilità non valida.");
  } else if (validator.isEmpty(body.description)) {
    return res.status(400).send("Descrione non valida");
  } else if (!file) {
    return res.status(400).send("Nessun file caricato.");
  }

  body.author = user._id;
  body.directory = req.file.filename;

  let document = new Document(body);

  document.save()
    .then((document) => {
      res.status(200).send("Documento caricato con successo.");
    }).catch((e) => {
      res.status(400).send(e);
    });

});

module.exports = router;