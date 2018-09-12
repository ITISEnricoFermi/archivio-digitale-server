const {
  mongoose
} = require('../mongoose')

const {
  DocumentType
} = require('../../models/document_type')

const documentTypeArray = require('../seeds/documentType.json')

let loadDocumentTypes = async () => {
  try {
    let docs = await DocumentType.insertMany(documentTypeArray, {
      ordered: false
    })

    if (!docs.length) return false
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  loadDocumentTypes
}
