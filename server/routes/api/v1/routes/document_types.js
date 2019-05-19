const express = require('express')
const router = express.Router()

const {
  getDocumentType,
  getDocumentTypes
} = require('../../../../controllers/document_types')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getDocumentType))

router.get('/', asyncMiddleware(getDocumentTypes))

module.exports = router
