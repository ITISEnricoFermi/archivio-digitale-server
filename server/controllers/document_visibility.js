const {
  DocumentVisibility
} = require('../models/document_visibility')

const getDocumentVisibility = async (req, res) => {
  let visibilities = await DocumentVisibility.getDocumentVisibility()
  res.status(200).send(visibilities)
}

module.exports = {
  getDocumentVisibility
}
