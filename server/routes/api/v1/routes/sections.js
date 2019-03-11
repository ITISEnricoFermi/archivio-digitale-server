const express = require('express')
const router = express.Router()

const {
  getSections
} = require('../../../../controllers/sections')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getSections))

module.exports = router
