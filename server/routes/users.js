const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");
const validator = require('validator');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/pics");
  },
  filename: function(req, file, cb) {
    cb(null, String(req.user._id) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {

  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
    cb(null, true);
  } else {
    cb(null, false);
  }

};

const limits = {
  fileSize: 1024 * 1024 * 2 // 2 MB
}

const upload = multer({
  storage,
  limits,
  fileFilter
});


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

router.get("/me/", authenticate, (req, res) => {

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

router.get("/me/documents/:visibility", authenticate, (req, res) => {

  Document.find({
      author: req.user._id,
      visibility: req.params.visibility
    })
    .populate("author", "firstname lastname img")
    .populate("type")
    .populate("faculty")
    .populate("subject")
    .populate("class")
    .populate("section")
    .sort({
      _id: 1
    })
    .then((documents) => {
      res.status(200)
        .header("x-userid", req.user._id)
        .header("x-userprivileges", req.user.privileges)
        .send(documents);
    })
    .catch((e) => {
      res.status(500).send(e);
    });

});

router.get("/me/documents/count/:visibility", authenticate, (req, res) => {
  Document.count({
      author: req.user._id,
      visibility: req.params.visibility
    })
    .then((documents) => {
      res.status(200).send(documents.toString());
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});


router.patch("/me/", authenticate, (req, res) => {

  var body = _.pick(req.body, ["old", "new"]);

  User.findByCredentials(req.user.email, body.old)
    .then((user) => {

      if (validator.isEmpty(body.new) || body.new.length < 6) {
        return res.status(400).send("Password non valida o troppo breve. (min. 6).");
      } else if (body.old === body.new) {
        return res.status(400).send("La password attuale è uguale a quella nuova.");
      }

      user.password = body.new;
      user.tokens = [];
      return user.save();
    })
    .then((user) => {
      res.status(200).send();
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

router.patch("/me/pic/", authenticate, upload.single("picToUpload"), (req, res) => {
  let file = req.file;

  if (!file) {
    return res.status(400).send("Nessun file caricato.");
  }

  User.findById(req.user._id)
    .then((user) => {
      user.img = file.filename;
      return user.save();
    })
    .then(() => {
      res.status(200).send("Immagine di profilo cambiata con successo.");
    })
    .catch((e) => {
      return Promise.reject(e);
    });

});

router.delete("/me/", authenticate, (req, res) => {

  User.findById(req.user._id)
    .then((user) => {
      user.state = "disabled";
      user.tokens = [];
      return user.save()
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});



router.post("/me/logged", authenticate, (req, res) => {
  res.status(200).send();
});

module.exports = router;