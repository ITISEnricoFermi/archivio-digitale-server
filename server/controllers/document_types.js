const {
  DocumentType
} = require('../models/document_type')

const getDocumentTypes = async (req, res) => {
  const documentTypes = await DocumentType.getDocumentTypes()
  res.status(200).send(documentTypes)
}

module.exports = {
  getDocumentTypes
}
