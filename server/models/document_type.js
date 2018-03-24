const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

const {
  ObjectId
} = require('mongodb')

var DocumentTypeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un ID valido.'
    }
  },
  type: {
    type: String,
    unique: true,
    required: true,
    minlength: 1
  }
})

DocumentTypeSchema.statics.getDocumentTypes = function () {
  var DocumentType = this

  return DocumentType.find({}).then((results) => {
    return Promise.resolve(results)
  }, (e) => {
    return Promise.reject(e)
  })
}

var DocumentType = mongoose.model('document_type', DocumentTypeSchema)

module.exports = {
  DocumentType
}
