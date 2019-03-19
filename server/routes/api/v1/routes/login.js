const express = require('express')
const router = express.Router()

// Config
const {
  signin
} = require('../../../../middlewares/authenticate')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  login
} = require('../../../../controllers/login')

router.post('/', signin, asyncMiddleware(login))

module.exports = router
