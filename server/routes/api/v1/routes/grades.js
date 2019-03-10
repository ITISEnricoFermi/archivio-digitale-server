const express = require('express')
const router = express.Router()

const {
  getGrades
} = require('../../../../controllers/grades')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getGrades))

module.exports = router
