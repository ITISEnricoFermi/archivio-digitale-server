const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  signup
} = require('../../../../controllers/signup')

router.post('/', asyncMiddleware(signup))

module.exports = router
