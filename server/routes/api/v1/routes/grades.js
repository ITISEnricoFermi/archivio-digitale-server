const express = require('express')
const router = express.Router()

const {
  getGrades
} = require('../../../../controllers/grades')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getGrades))

module.exports = router
