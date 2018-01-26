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

router.post("/recentPosts", authenticate, (req, res) => {

  Document.find({

    })
    .limit(3)
    .sort({
      _id: -1
    })
    .populate("author", "firstname lastname")
    .populate("type")
    .populate("faculty")
    .populate("subject")
    .populate("class")
    .populate("section")
    .then((documents) => {
      res.status(200).send(documents);
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

router.post("/getTopPublishers", (req, res) => {

});

module.exports = router;