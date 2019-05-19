const express = require('express')
const router = express.Router()

const {
  getDocumentVisibility,
  getDocumentVisibilities
} = require('../../../../controllers/document_visibility')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getDocumentVisibility))

router.get('/', asyncMiddleware(getDocumentVisibilities))

module.exports = router
