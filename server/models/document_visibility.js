const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var DocumentVisibilitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è un ID valido."
    }
  },
  visibility: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: false
  }
});

DocumentVisibilitySchema.statics.getDocumentVisibility = function() {
  var DocumentVisibility = this;

  return DocumentVisibility.find()
    .then((visibilities) => {
      return Promise.resolve(visibilities);
    }, (e) => {
      return Promise.reject(e);
    });
};

var DocumentVisibility = mongoose.model("document_visibility", DocumentVisibilitySchema);

module.exports = {
  DocumentVisibility
};