const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");

// Middleware
const {
  authenticate,
  authenticateAccesses
} = require("./../middleware/authenticate");

// Models
const {
  User
} = require("./../models/user");

const {
  Document
} = require("./../models/document");

router.post("/recentPosts", authenticate, (req, res) => {

  if (req.user.privileges === "user") {
    var query = {
      $or: [{
        visibility: "pubblico"
      }, {
        visibility: "areariservata"
      }, {
        $and: [{
          visibility: "materia"
        }, {
          subject: {
            $in: req.user.accesses
          }
        }]
      }]
    };
  }

  Document.find(query || {})
    .limit(3)
    .sort({
      _id: -1
    })
    .populate("author", "firstname lastname img")
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