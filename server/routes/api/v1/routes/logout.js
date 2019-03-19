const express = require('express')
const router = express.Router()

// Middleware
const logged = require('../../../../middlewares/logged')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  logout
} = require('../../../../controllers/logout')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

router.get('/logout',
  authenticate,
  logged,
  asyncMiddleware(logout))

module.exports = router
