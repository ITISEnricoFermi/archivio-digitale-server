const mongoose = require('mongoose')

const DocumentTypeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  type: {
    type: String,
    unique: true,
    required: true,
    minlength: 1
  }
})

DocumentTypeSchema.statics.getDocumentTypes = function () {
  const DocumentType = this

  return DocumentType.find({}).then((results) => {
    return Promise.resolve(results)
  }, (e) => {
    return Promise.reject(e)
  })
}

const DocumentType = mongoose.model('document_type', DocumentTypeSchema)

module.exports = {
  DocumentType
}
