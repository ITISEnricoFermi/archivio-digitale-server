const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  DocumentType
} = require('../../../../models/document_type')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let documentTypes = await DocumentType.getDocumentTypes()
  res.status(200).send(documentTypes)
}))

module.exports = router
