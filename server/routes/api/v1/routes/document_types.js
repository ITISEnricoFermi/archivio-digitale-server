const express = require('express')
const router = express.Router()

const {
  getDocumentTypes
} = require('../../../../controllers/document_types')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getDocumentTypes))

module.exports = router
