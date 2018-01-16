const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var SectionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è un ID valido."
    }
  },
  section: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è una sezione valida."
    }
  }
});


SectionSchema.statics.getSections = function() {
  var Section = this;

  return Section.find()
    .then((sections) => {
      return Promise.resolve(sections);
    }, (e) => {
      return Promise.reject(e);
    });

};

var Section = mongoose.model("Section", SectionSchema);

module.exports = {
  Section
};