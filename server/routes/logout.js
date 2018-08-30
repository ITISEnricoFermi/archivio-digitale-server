const express = require('express')
const router = express.Router()

// Middleware
const {
  authenticate
} = require('../middleware/authenticate')

const {
  asyncMiddleware
} = require('../middleware/async')

/*
 * Utente loggato
 */
router.get('/logout', authenticate, asyncMiddleware(async (req, res) => {
  res.status(200).clearCookie('token').redirect('/')
}))

module.exports = router
