const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const {
  ObjectId
} = require("mongodb");

var DocumentCollectionSchema = new mongoose.Schema({
  documentCollection: { // Nome della collezione
    type: String,
    required: true,
    minlength: 1,
    unique: false
  },
  author: { // Autore della collezione
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "User"
  },
  documents: [{ // Lista dei documenti nella collezione
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "Document"
  }],
  permissions: { // Possibilià di modifica e di aggiunta di documenti
    type: String,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    default: "tutti",
    ref: "collection_permission"
  },
  authorizations: [{ // Proprietari della collezione
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "User"
  }]
});

DocumentCollectionSchema.statics.getCollections = function() {
  var DocumentCollection = this;

  return DocumentCollection.find({})
    .then((results) => {
      return Promise.resolve(results);
    }, (e) => {
      return Promise.reject(e);
    });

};



DocumentCollectionSchema.statics.searchCollections = function(search) {
  // DocumentCollectionSchema.statics.searchCollections = function(search, user) {
  var DocumentCollection = this;

  var andQuery = [];

  // if (user.privileges === "user") {
  //   var orQuery = {
  //     $or: [{
  //       visibility: "pubblico"
  //     }, {
  //       visibility: "areariservata"
  //     }, {
  //       $and: [{
  //         visibility: "materia"
  //       }, {
  //         subject: {
  //           $in: user.accesses
  //         }
  //       }]
  //     }]
  //   };
  //
  // }

  // andQuery.push(orQuery || {});

  if (search.fulltext) {

    andQuery.push({
      $text: {
        $search: search.fulltext
      }
    });

  }

  if (search.permissions) {
    andQuery.push({
      type: search.permissions
    });
  }


  return DocumentCollection.find({
      $and: andQuery
    }, {
      score: {
        $meta: "textScore"
      }
    }).sort({
      score: {
        $meta: "textScore"
      }
    })
    .populate("author")
    .populate("documents")
    .populate("permission")
    .populate("authorizations")
    .limit(10)
    .then((results) => {
      return Promise.resolve(results);
    }, (e) => {
      return Promise.reject(e);
    });

};

DocumentCollectionSchema.index({
  documentCollection: "text"
});

var DocumentCollection = mongoose.model("document_collection", DocumentCollectionSchema);

module.exports = {
  DocumentCollection
};