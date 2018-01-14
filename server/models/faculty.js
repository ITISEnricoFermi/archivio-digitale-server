const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var FacultySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  faculty: {
    type: String,
    required: true,
    unique: true,
    minlength: 1
  },
  subjects: [{
    type: String,
    unique: false,
    required: true,
    minlength: 1,
    trim: true,
    ref: "Subject"
  }]
});

FacultySchema.statics.getFaculties = function() {
  var Faculty = this;

  return Faculty.find({})
    .populate("subjects")
    .then((results) => {
      return Promise.resolve(results);
    }, (e) => {
      return Promise.reject(e);
    });

};

var Faculty = mongoose.model("Faculty", FacultySchema);

module.exports = {
  Faculty
};