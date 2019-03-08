const express = require('express')
const router = express.Router()

const {
  getFaculties
} = require('../../../../controllers/faculties')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getFaculties))

module.exports = router
