const mongoose = require('mongoose')

const DocumentVisibilitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  visibility: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: false
  }
})

DocumentVisibilitySchema.statics.getDocumentVisibility = function () {
  const DocumentVisibility = this

  return DocumentVisibility.find()
    .then((visibilities) => {
      return Promise.resolve(visibilities)
    }, (e) => {
      return Promise.reject(e)
    })
}

const DocumentVisibility = mongoose.model('document_visibility', DocumentVisibilitySchema)

module.exports = {
  DocumentVisibility
}
