const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  Section
} = require('../../../../models/section')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let sections = await Section.getSections()
  res.status(200).send(sections)
}))

module.exports = router
