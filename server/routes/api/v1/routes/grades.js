const express = require('express')
const router = express.Router()

const {
  getGrade,
  getGrades
} = require('../../../../controllers/grades')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getGrade))

router.get('/', asyncMiddleware(getGrades))

module.exports = router
