const express = require('express')
const router = express.Router()
const validator = require('validator')

// Middleware

const {
  asyncMiddleware
} = require('../middleware/async')

// Models
const {
  User
} = require('./../models/user')

/*
 * Utente non loggato
 */
router.post('/', asyncMiddleware(async (req, res) => {
  let { email, password } = req.body

  // Validazione
  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      messages: ['Email non valida.']
    })
  } else if (validator.isEmpty(password) || password.length < 6) {
    return res.status(400).json({
      messages: ['Password non valida o troppo breve. (min. 6).']
    })
  }

  let user = await User.findByCredentials(email, password)
  let token = await user.generateAuthToken()
  res.cookie('token', token)
    .header('x-auth', token)
    .send(token)
}))

module.exports = router
