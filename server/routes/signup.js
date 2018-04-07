const express = require('express')
const router = express.Router()
const _ = require('lodash')
const validator = require('validator')

// Middleware
const {
  asyncMiddleware
} = require('../middleware/async')

// Models
const {
  User
} = require('./../models/user')

const {
  Subject
} = require('./../models/subject')

/*
 * Utente non loggato
 */
router.put('/', asyncMiddleware(async (req, res) => {
  const body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'accesses'])
  let user = new User(body)

  if (validator.isEmpty(body.firstname) || !validator.isAlpha(body.firstname)) {
    return res.status(400).send({
      messages: ['Nome non valido.']
    })
  } else if (validator.isEmpty(body.lastname) || !validator.isAlpha(body.lastname)) {
    return res.status(400).send({
      messages: ['Cognome non valido']
    })
  } else if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
    return res.status(400).send({
      messages: ['Email non valida.']
    })
  } else if (validator.isEmpty(body.password) || body.password.length < 6) {
    return res.status(400).send({
      messages: ['Password non valida o troppo breve. (min. 6).']
    })
  } else if (body.accesses.length === 0) {
    return res.status(400).send({
      messages: 'Inserire delle autorizzazioni.'
    })
  }

  // Formattazione
  body.firstname = _.startCase(_.lowerCase(body.firstname))
  body.lastname = _.startCase(_.lowerCase(body.lastname))

  const orQuery = {
    $or: []
  }

  for (let i = 0; i < body.accesses.length; i += 1) {
    orQuery.$or.push({
      _id: body.accesses[i]._id
    })
  }

  let subjects = await Subject.find(orQuery).count()

  if (subjects !== body.accesses.length) {
    return res.status(400).send({
      messages: ['Una delle autorizzazioni non è valida.']
    })
  }

  let dbUser = await User.findByEmail(body.email)

  if (dbUser) {
    return res.status(400).send({
      messages: ['Utente già registrato.']
    })
  }

  user = await user.save()
  let token = await user.generateAuthToken()
  return res.header('x-auth', token).send(user)
}))

module.exports = router
