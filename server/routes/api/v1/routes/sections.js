const express = require('express')
const router = express.Router()

const {
  getSections
} = require('../../../../controllers/sections')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getSections))

module.exports = router
