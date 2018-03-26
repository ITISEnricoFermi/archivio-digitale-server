const express = require('express')
const router = express.Router()
const _ = require('lodash')

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require('./../middleware/authenticate')

const {
  adminCheckOldUser,
  adminCheckNewUser,
  checkErrors
} = require('../middleware/check')

const {
  asyncMiddleware
} = require('../middleware/async')

// Models
const {
  User
} = require('./../models/user')

/*
 * Utente loggato
 * Utente admin
 */
router.put('/users/', authenticate, authenticateAdmin, adminCheckNewUser, checkErrors, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.user, ['firstname', 'lastname', 'email', 'password', 'privileges', 'accesses'])
  let user = new User(body)

  // Formattazione
  body.firstname = _.startCase(_.lowerCase(body.firstname))
  body.lastname = _.startCase(_.lowerCase(body.lastname))
  user.state = 'active'

  user = await user.save()
  res.status(200).send(user)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.patch('/users/:id', authenticate, authenticateAdmin, adminCheckOldUser, checkErrors, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.user, ['firstname', 'lastname', 'email', 'privileges', 'accesses'])

  let user = await User.findByIdAndUpdate(req.params.id, {
    $set: body
  })

  res.status(200).send(user)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/users/:id', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  res.status(200).send(await User.findById(req.params.id))
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/users/search/:key', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let users = await User.find({
    $text: {
      $search: req.params.key
    },
    _id: {
      $ne: req.user._id
    },
    state: {
      $ne: 'pending'
    }
  }, {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  })

  res.status(200).send(users)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/requests/', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let users = await User.find({state: 'pending'})
  res.status(200).send(users)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/acceptRequestById', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findById(req.body._id)
  user.state = 'active'
  await user.save()
  res.status(200).send({
    messages: ['Richiesta d\'iscrizione accettata.']
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/refuseRequestById', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findByIdAndRemove(req.body._id)

  if (!user) {
    return res.status(400).send({
      messages: ['L\'utente non esiste']
    })
  }

  return res.status(200).send({
    messages: ['Richiesta d\'iscrizione rifiutata.']
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/resetPassword', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findById(req.body._id)
  let hash = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
  user.tokens = []
  user.password = hash
  await user.save()
  return res.status(200).send({
    password: hash
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/togglePrivileges', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findById(req.body._id)
  user.privileges === 'admin' ? user.privileges = 'user' : user.privileges = 'admin'
  res.status(200).send(await user.save())
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/toggleState', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findById(req.body._id)
  user.state === 'active' ? user.state = 'disabled' : user.state = 'active'
  res.status(200).send(await user.save())
}))

module.exports = router
