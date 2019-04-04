const express = require('express')
const router = express.Router()

const {
  getDocumentVisibilities
} = require('../../../../controllers/document_visibility')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getDocumentVisibilities))

module.exports = router
