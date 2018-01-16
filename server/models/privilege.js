const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var PrivilegeSchema = new mongoose.Schema({
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
  privilege: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è un privilegio valido."
    }
  }
});

var Privilege = mongoose.model("Privlege", PrivilegeSchema);

module.exports = {
  Privlege
};