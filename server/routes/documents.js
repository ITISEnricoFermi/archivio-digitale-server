const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");
const multer = require('multer');
const validator = require('validator');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/documents");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  const mimeypes = ["audio/aac", "video/x-msvideo", "text/csv", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/epub+zip", "image/gif", "image/x-icon", "image/jpeg", "audio/midi",
    "video/mpeg", "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.text",
    "audio/ogg", "video/ogg", "application/ogg", "image/png", "application/pdf",
    "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/x-rar-compressed", "application/rtf", "application/x-tar", "image/tiff", "application/vnd.visio",
    "audio/x-wav", "audio/webm", "video/webm", "image/webp", "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip", "application/x-7z-compressed", "text/plain"
  ];

  if (mimeypes.indexOf(file.mimetype) === -1) {
    cb(null, false); // Il file usa un formato non ammesso
  } else {
    cb(null, true); // Il file usa un formato permesso
  }

};

const limits = {
  fileSize: 1024 * 1024 * 100 // 100 MB
}

const upload = multer({
  storage,
  limits,
  fileFilter
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


router.get("/*", authenticate, (req, res, next) => {
  next();
});

router.get("/info/:id", authenticate, (req, res) => {

  let body = _.pick(req.params, ["id"]);

  Document.findDocumentById({
      _id: body.id
    })
    .then((document) => {
      res.status(200).send(document);
    })
    .catch((e) => {
      res.status(500).send("Errore nel reperire il documento.");
    });
});

router.put("/", authenticate, upload.single("fileToUpload"), (req, res) => {

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
    // } else if (!validator.isInt(body.class)) {
    //   return res.status(400).send("Classe non valida.");
    // } else if (!validator.isAlpha(body.section)) {
    //   return res.status(400).send("Sezione non valida");
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
      res.status(201).send(document);
    }).catch((e) => {
      res.status(500).send(e);
    });

});

router.patch("/:id", authenticate, (req, res) => {

  let body = _.pick(req.body, ["name", "type", "faculty", "subject", "class", "section", "visibility", "description"])

  if (validator.isEmpty(body.name)) {
    return res.status(400).send("Nome non valido.");
  } else if (validator.isEmpty(body.type)) {
    return res.status(400).send("Tipo non valido.");
  } else if (validator.isEmpty(body.faculty) || !validator.isAlpha(body.faculty)) {
    return res.status(400).send("Specializzazione non valida.");
  } else if (validator.isEmpty(body.subject) || !validator.isAlpha(body.subject)) {
    return res.status(400).send("Materia non valida.");
    // } else if (!validator.isInt(body.class)) {
    //   return res.status(400).send("Classe non valida.");
    // } else if (!validator.isAlpha(body.section)) {
    //   return res.status(400).send("Sezione non valida");
  } else if (validator.isEmpty(body.visibility) || !validator.isAlpha(body.visibility)) {
    return res.status(400).send("Visibilità non valida.");
  } else if (validator.isEmpty(body.description)) {
    return res.status(400).send("Descrione non valida");
  }

  Document.findByIdAndUpdate(req.params.id, {
      $set: body
    })
    .then((document) => {
      res.status(200).send("Documento modificato con successo.");
    })
    .catch((e) => {
      res.status(500).send("Nessun documento corrispondente all'ID.");
    });

});



router.delete("/:id", authenticate, (req, res) => {

  Document.findById(req.params.id)
    .then((document) => {

      if (document.author._id !== req.user._id && req.user.privileges !== "admin") {
        return res.status(401).send("Non si detengono le autorizzazioni per eliminare il documento.");
      }

      return Document.remove({
          _id: req.params.id
        })
        .then(() => {
          res.status(200).send("Documento eliminato correttamente.");
        });
    })
    .catch((e) => {
      res.status(500).send(e);
    })
});


module.exports = router;