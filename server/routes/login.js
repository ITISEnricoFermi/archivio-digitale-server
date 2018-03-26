const express = require('express')
const router = express.Router()
const _ = require('lodash')
const validator = require('validator')

const history = require('connect-history-api-fallback')
router.use(history())

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
  var body = _.pick(req.body, ['email', 'password'])

  // Validazione
  if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send('Email non valida.')
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send('Password non valida o troppo breve. (min. 6).')
  }

  let user = await User.findByCredentials(body.email, body.password)
  let token = await user.generateAuthToken()
  res.cookie('token', token)
    .header('x-auth', token)
    .send(token)
}))

module.exports = router
