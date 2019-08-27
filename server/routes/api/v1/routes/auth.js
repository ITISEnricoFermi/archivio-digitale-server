const express = require('express')
const router = express.Router()

const {
  requestRegister,
  register,
  loginChallenge,
  login
} = require('../../../../controllers/auth')

// Middleware
const logged = require('../../../../middlewares/logged')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

router.post('/request-register',
  authenticate,
  logged,
  asyncMiddleware(requestRegister))

router.post('/register',
  authenticate,
  logged,
  asyncMiddleware(register))

router.post('/login', asyncMiddleware(login))

router.post('/login-challenge', asyncMiddleware(loginChallenge))

module.exports = router
