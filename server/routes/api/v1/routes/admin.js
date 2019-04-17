const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {
  sanitizeParam
} = require('express-validator/filter')

const {
  body
} = require('express-validator/check')

const {
  ObjectId
} = mongoose.Types

const {
  postUser,
  patchUser,
  sendEmail,
  getRequests,
  acceptRequest,
  refuseRequest,
  toggleState,
  resetPassword
} = require('../../../../controllers/admin')

// Middleware
const logged = require('../../../../middlewares/logged')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  checkErrors,
  checkUserById,
  checkAdminById
} = require('../../../../middlewares/check')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  User
} = require('../../../../models/user')

router.post('/users/',
  authenticate,
  logged,
  checkAdminById,
  body('email').custom((value) => User.findByEmail(value)
    .then(user => {
      if (user) {
        return Promise.reject(new Error('L\'email inserita è già in uso.'))
      }
    })),
  body('firstname')
    .not().isEmpty().withMessage('Il nome è obbligatorio.')
    .trim()
    .escape(),
  body('lastname')
    .not().isEmpty().withMessage('Il cognome è obbligatorio.')
    .trim()
    .escape(),
  checkErrors,
  asyncMiddleware(postUser))

router.patch('/users/:id',
  authenticate,
  logged,
  checkAdminById,
  checkUserById,
  body('email')
    .isEmail()
    .normalizeEmail(),
  checkErrors,
  asyncMiddleware(patchUser))

router.patch('/users/:id/state/',
  authenticate,
  logged,
  checkAdminById,
  checkUserById,
  checkErrors,
  asyncMiddleware(toggleState))

router.patch('/users/:id/password',
  authenticate,
  logged,
  checkAdminById,
  checkUserById,
  checkErrors,
  asyncMiddleware(resetPassword))

router.post('/mails/',
  authenticate,
  logged,
  checkAdminById,
  checkErrors,
  asyncMiddleware(sendEmail))

router.get('/requests/',
  authenticate,
  logged,
  checkAdminById,
  checkErrors,
  asyncMiddleware(getRequests))

router.patch('/requests/:id',
  authenticate,
  logged,
  checkAdminById,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  checkErrors,
  asyncMiddleware(acceptRequest))

router.delete('/requests/:id',
  authenticate,
  logged,
  checkAdminById,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  checkErrors,
  asyncMiddleware(refuseRequest))

module.exports = router
