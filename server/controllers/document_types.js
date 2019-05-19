const {
  DocumentType
} = require('../models/document_type')

const getDoumentType = async ({ params: { id } }, res) => {
  const type = await DocumentType.findById(id)

  if (!type) {
    return res.status(404).json({
      messages: ['Il tipo di documento non esiste.']
    })
  }

  res.status(200).json(type)
}

const getDocumentTypes = async (req, res) => {
  const types = await DocumentType.getDocumentTypes()
  res.status(200).json(types)
}

module.exports = {
  getDoumentType,
  getDocumentTypes
}
