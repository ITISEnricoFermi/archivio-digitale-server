const {
  mongoose
} = require('../mongoose')

const {
  DocumentVisibility
} = require('../../models/document_visibility')

const documentVisibilityArray = require('../seeds/documentType.json')

let loadDocumentVisibilities = () => {
  documentVisibilityArray.forEach((visibility) => {
    let documentVisibilityToInsert = new DocumentVisibility(visibility)
    documentVisibilityToInsert.save()
  })
}

module.exports = {
  loadDocumentVisibilities
}
