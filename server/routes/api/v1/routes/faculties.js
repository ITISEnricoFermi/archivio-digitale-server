const express = require('express')
const router = express.Router()

const {
  getFaculty,
  getFaculties
} = require('../../../../controllers/faculties')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getFaculty))

router.get('/', asyncMiddleware(getFaculties))

module.exports = router
