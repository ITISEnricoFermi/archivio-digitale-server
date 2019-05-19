const {
  DocumentVisibility
} = require('../models/document_visibility')

const getDocumentVisibility = async ({ params: { id } }, res) => {
  const visibility = await DocumentVisibility.findById(id)

  if (!visibility) {
    return res.status(404).json({
      messages: ['Il criterio di visibilità non esiste.']
    })
  }

  res.status(200).json(visibility)
}

const getDocumentVisibilities = async (req, res) => {
  const visibilities = await DocumentVisibility.getDocumentVisibilities()
  res.status(200).json(visibilities)
}

module.exports = {
  getDocumentVisibility,
  getDocumentVisibilities
}
