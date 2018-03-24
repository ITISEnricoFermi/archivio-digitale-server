const {
  mongoose
} = require('../mongoose')

const {
  DocumentType
} = require('../../models/document_type')

const documentTypeArray = require('../seeds/documentType.json')

let loadDocumentTypes = () => {
  documentTypeArray.forEach((documentType) => {
    let documentTypeToInsert = new DocumentType(documentType)

    documentTypeToInsert.save()
  })
}

module.exports = {
  loadDocumentTypes
}
