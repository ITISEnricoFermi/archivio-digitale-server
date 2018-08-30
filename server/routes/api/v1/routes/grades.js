const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  Grade
} = require('../../../../models/grade')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let classes = await Grade.getGrades()
  res.status(200).send(classes)
}))

module.exports = router
