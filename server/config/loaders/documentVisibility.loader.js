const {
  mongoose
} = require('../mongoose')

const {
  DocumentVisibility
} = require('../../models/document_visibility')

const documentVisibilityArray = require('../seeds/documentVisibility.json')

let loadDocumentVisibilities = async () => {
  try {
    let docs = await DocumentVisibility.insertMany(documentVisibilityArray, {
      ordered: false
    })

    if (!docs.length) return false
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  loadDocumentVisibilities
}
