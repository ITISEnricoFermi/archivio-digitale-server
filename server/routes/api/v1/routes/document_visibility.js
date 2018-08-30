const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  DocumentVisibility
} = require('../../../../models/document_visibility')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let visibilities = await DocumentVisibility.getDocumentVisibility()
  res.status(200).send(visibilities)
}))

module.exports = router
