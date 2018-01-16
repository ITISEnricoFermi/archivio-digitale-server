const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const {
  ObjectId
} = require("mongodb");

var DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: false
  },
  type: {
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "document_type"
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: "User"
  },
  faculty: {
    type: String,
    unique: false,
    required: false,
    trim: true,
    ref: "Faculty"
  },
  subject: {
    type: String,
    required: false,
    trim: true,
    minlength: 1,
    unique: false,
    ref: "Subject"
  },
  class: {
    type: Number,
      required: true,
      minlength: 1,
      maxlength: 1,
      unique: false,
      trim: true,
      ref: "Class"
  },
  section: {
    type: String,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è una sezione valida."
    },
    ref: "Section"
  },
  visibility: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: false,
    validate: {
      validator: validator.isAlpha,
      message: "{VALUE} non è un criterio di visibilità valido."
    },
    ref: "DocumentVisibility"
  },
  description: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: false
  },
  directory: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  }
});

DocumentSchema.statics.getDocuments = function() {
  var Document = this;

  return Document.find({}).then((results) => {
    return Promise.resolve(results);
  }, (e) => {
    return Promise.reject(e);
  });

};

DocumentSchema.statics.searchAdvancedDocuments = function(search) {
  var Document = this;

  var andQuery = [];

  if (search.name) {

    andQuery.push({
      $text: {
        $search: search.name
      }
    });

  }

  if (search.type) {
    andQuery.push({
      type: search.type
    });
  }

  if (search.faculty) {
    andQuery.push({
      faculty: search.faculty
    });
  }

  if (search.subject) {
    andQuery.push({
      subject: search.subject
    });
  }

  if (search.class) {
    andQuery.push({
      class: search.class
    });
  }

  if (search.section) {
    andQuery.push({
      section: search.section
    });
  }

  if (search.visibility) {
    andQuery.push({
      visibility: search.visibility
    });
  }

  return Document.find({
      $and: andQuery,
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
    .populate("type", "type")
    .populate({
      path: "faculty",
      select: "faculty"
    })
    .populate({
      path: "subject",
      select: "subject"
    })
    .limit(10)
    .then((results) => {
      return Promise.resolve(results);
    }, (e) => {
      return Promise.reject(e);
    });

};

DocumentSchema.statics.findDocumentById = function(id) {
  var Document = this;

  return Document.findById(id)
    .populate("author")
    .populate("type", "type")
    .populate({
      path: "faculty",
      select: "faculty"
    })
    .populate({
      path: "subject",
      select: "subject"
    })
    .populate({
      path: "DocumentVisibility",
      select: "visibility"
    }).then((document) => {
      return Promise.resolve(document);
    }, (e) => {
      return Promise.reject(e);
    });

};

DocumentSchema.index({
  name: "text"
});

var Document = mongoose.model("Document", DocumentSchema);

module.exports = {
  Document
};