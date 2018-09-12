const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  Faculty
} = require('../../../../models/faculty')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let faculties = await Faculty.getFaculties()
  res.status(200).send(faculties)
}))

module.exports = router
