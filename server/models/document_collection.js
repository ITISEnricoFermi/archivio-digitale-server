const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const {
  ObjectId
} = require("mongodb");

var DocumentCollectionSchema = new mongoose.Schema({
  documentCollection: {
    type: String,
    required: true,
    minlength: 1,
    unique: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "User"
  },
  documents: [{
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "Document"
  }],
  permission: {
    type: String,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "collection_permission"
  },
  authorizations: [{
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "User"
  }]
});

DocumentCollectionSchema.index({
  documentCollection: "text"
});

var DocumentCollection = mongoose.model("document_collection", DocumentCollectionSchema);

module.exports = {
  DocumentCollection
};