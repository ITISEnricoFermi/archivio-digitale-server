const {
  DocumentVisibility
} = require('../models/document_visibility')

const getDocumentVisibilities = async (req, res) => {
  const visibilities = await DocumentVisibility.getDocumentVisibilities()
  res.status(200).send(visibilities)
}

module.exports = {
  getDocumentVisibilities
}
