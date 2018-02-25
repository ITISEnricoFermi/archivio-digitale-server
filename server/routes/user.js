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

router.post("/me/logged", authenticate, (req, res) => {
  res.status(200).send();
});

module.exports = router;