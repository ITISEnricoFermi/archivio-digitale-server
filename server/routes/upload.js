const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");

// Middleware
const {
  authenticate
} = require("./../middleware/authenticate");

// Models

router.post("/documentUpload", authenticate, (req, res) => {

  var fileName = req.files.fileToUpload.name;
  var fileType = req.files.fileToUpload.mimetype;
  var userName = req.user._id;

  var help = {
    fileName,
    fileType,
    userName
  }

  if (!req.files) {
    return res.status(400).send("Nessun file selezionato.");
  }

  var fileToUpload = req.files.fileToUpload;

  fileToUpload.mv(__dirname + `/../public/documents/${userName}.jpg`)
    .then(() => {
      res.status(200).send(help);
    }).catch((e) => {
      res.status(400).send(e);
    });

});

module.exports = router;