const express = require('express')
const router = express.Router()

// Config
const {
  signin
} = require('../middlewares/authenticate')

// Middleware
const {
  asyncMiddleware
} = require('../middlewares/async')

/*
 * Utente non loggato
 */
router.post('/', signin, asyncMiddleware(async (req, res) => {
  const {user} = req
  const token = await user.generateAuthToken()
  res.status(200).json({
    token
  })
}))

module.exports = router
