const express = require('express')
const passport = require('passport')
const router = express.Router()

// Config
const {
  login
} = require('../config/passport')

// Middleware
const {
  asyncMiddleware
} = require('../middleware/async')

passport.use('login', login)

/*
 * Utente non loggato
 */
router.post('/', passport.authenticate('login', { session: false }), asyncMiddleware(async (req, res) => {
  const {user} = req
  let token
  try {
    token = await user.generateAuthToken()
  } catch (e) {
    throw new Error('Si è verificato un errore durante la generazione del token.')
  }
  res.status(200).json({
    token
  })
}))

module.exports = router
