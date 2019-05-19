const express = require('express')
const router = express.Router()

const {
  getSection,
  getSections
} = require('../../../../controllers/sections')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getSection))

router.get('/', asyncMiddleware(getSections))

module.exports = router
