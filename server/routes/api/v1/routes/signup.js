const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  signup
} = require('../../../../controllers/signup')

const {
  body
} = require('express-validator/check')

const {
  checkErrors
} = require('../../../../middlewares/check')

// Models
const {
  User
} = require('../../../../models/user')

const {
  Subject
} = require('../../../../models/subject')

router.post('/',
  body('firstname')
    .not().isEmpty().withMessage('Il nome è obbligatorio.')
    .trim()
    .escape(),
  body('lastname')
    .not().isEmpty().withMessage('Il cognome è obbligatorio.')
    .trim()
    .escape(),
  body('email')
    .not().isEmpty().withMessage('L\'indirizzo email è obbligatorio.')
    .isEmail().withMessage('L\'indirizzo email non è valido.')
    .custom(value => User.findByEmail(value)
      .then(user => {
        if (user) {
          return Promise.reject(new Error('L\'email inserita è già in uso.'))
        }
      }))
    .trim()
    .escape(),
  body('accesses')
    .not().isEmpty().withMessage('Le autorizzazioni sono obbligatorie.')
    .custom(value => Subject.count({
      _id: {
        $in: value
      }
    })
      .then(count => {
        if (count !== value.length) {
          return Promise.reject(new Error('Autorizzazioni non valide.'))
        }
      })),
  checkErrors,
  asyncMiddleware(signup))

module.exports = router
