const express = require('express')
const router = express.Router()

const {
  getDocumentTypes
} = require('../../../../controllers/document_types')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getDocumentTypes))

module.exports = router
