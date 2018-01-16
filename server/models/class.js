const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var ClassSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isInt,
      message: "{VALUE} non è un ID valido."
    }
  },
  class: {
    type: Number,
      required: true,
      unique: false,
      minlength: 1,
      trim: true,
      validate: {
        validator: validator.isInt,
        message: "{VALUE} non è una classe valida."
      }
  }
});

var Class = mongoose.model("Class", ClassSchema);

module.exports = {
  Class
};