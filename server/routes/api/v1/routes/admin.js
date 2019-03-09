const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {
  sanitizeParam
} = require('express-validator/filter')

const {
  check,
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
  authenticate,
  authenticateAdmin
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.post('/users/',
  body('firstname')
    .not().isEmpty().withMessage('Il nome è obbligatorio.')
    .not().equals('undefined').withMessage('Il nome è obbligatorio.')
    .trim()
    .escape(),
  (req, res, next) => {
    console.log(req.body.firstname)
    next()
  },
  check('lastname')
    .not().isEmpty().withMessage('Il cognome è obbligatorio.')
    .trim()
    .escape(),
  authenticate,
  authenticateAdmin,
  asyncMiddleware(postUser))

router.patch('/users/:id',
  authenticate,
  authenticateAdmin,
  body('email')
    .isEmail()
    .normalizeEmail(),
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(patchUser))

router.patch('/users/:id/state/',
  authenticate,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(toggleState))

router.patch('/users/:id/password',
  authenticate,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(resetPassword))

router.post('/mails/', authenticate, authenticateAdmin, asyncMiddleware(sendEmail))
router.get('/requests/', authenticate, authenticateAdmin, asyncMiddleware(getRequests))

router.patch('/requests/:id',
  authenticate,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(acceptRequest))

router.delete('/requests/:id',
  authenticate,
  authenticateAdmin,
  sanitizeParam('id')
    .customSanitizer(value => {
      return ObjectId(value)
    }),
  asyncMiddleware(refuseRequest))

module.exports = router
