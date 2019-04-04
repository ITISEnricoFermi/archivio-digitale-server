const mongoose = require('mongoose')

const DocumentVisibilitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un ID valido.'
    // }
  },
  visibility: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: false
  }
})

DocumentVisibilitySchema.statics.getDocumentVisibilities = function () {
  const DocumentVisibility = this

  return DocumentVisibility.find()
    .then(visibilities => {
      return Promise.resolve(visibilities)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const DocumentVisibility = mongoose.model('document_visibility', DocumentVisibilitySchema)

module.exports = {
  DocumentVisibility
}
