const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {
  sanitizeParam
} = require('express-validator/filter')

const {
  check,
  param,
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
const {
  authenticateAdmin
} = require('../../../../middlewares/authenticate')

const logged = require('../../../../middlewares/logged')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  checkErrors,
  checkUserById
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
  authenticateAdmin,
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
  check('lastname')
    .not().isEmpty().withMessage('Il cognome è obbligatorio.')
    .trim()
    .escape(),
  checkErrors,
  asyncMiddleware(postUser))

router.patch('/users/:id',
  authenticate,
  logged,
  authenticateAdmin,
  checkUserById,
  body('email')
    .isEmail()
    .normalizeEmail(),
  checkErrors,
  asyncMiddleware(patchUser))

router.patch('/users/:id/state/',
  authenticate,
  logged,
  authenticateAdmin,
  checkUserById,
  checkErrors,
  asyncMiddleware(toggleState))

router.patch('/users/:id/password',
  authenticate,
  logged,
  authenticateAdmin,
  checkUserById,
  checkErrors,
  asyncMiddleware(resetPassword))

router.post('/mails/',
  authenticate,
  logged,
  authenticateAdmin,
  asyncMiddleware(sendEmail))

router.get('/requests/',
  authenticate,
  logged,
  authenticateAdmin,
  asyncMiddleware(getRequests))

router.patch('/requests/:id',
  authenticate,
  logged,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(acceptRequest))

router.delete('/requests/:id',
  authenticate,
  logged,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(refuseRequest))

module.exports = router
