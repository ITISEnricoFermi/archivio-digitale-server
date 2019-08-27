const express = require('express')
const router = express.Router()

// Middleware
const {
  param,
  body
} = require('express-validator')

const logged = require('../../../../middlewares/logged')
const upload = require('../../../../middlewares/file_upload')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  checkErrors,
  checkUserById
} = require('../../../../middlewares/check')

// Models
const {
  User
} = require('../../../../models/user')

const {
  DocumentVisibility
} = require('../../../../models/document_visibility')

const {
  getUser,
  patchUser,
  deleteUser,
  searchUser,
  getDocumentsOnVisibility,
  countDocumentsOnVisibility,
  patchPicOfUser,
  deleteDocumentsByUser,
  getKeys
} = require('../../../../controllers/users')

router.get('/:id',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(getUser))

// TODO: Verifica dei criteri
// if (validator.isEmpty(user.passwords.new) || user.passwords.new.length < 6) {
//   req.messages.push('Password non valida o troppo breve. (min. 6).')
// } else if (user.passwords.old === user.passwords.new) {
//   req.messages.push('La password attuale è uguale a quella nuova.')
// } else if (!await User.findByCredentials(req.user.email, user.passwords.old)) {
//   req.messages.push('La password attuale non è corretta.')
// } else {
//   user.password = user.passwords.new
//   delete user.passwords
// }

router.patch('/:id',
  authenticate,
  logged,
  checkUserById,
  body('email')
    .not().isEmpty().withMessage('L\'indirizzo email è obbligatorio.')
    .isEmail().withMessage('L\'indirizzo email non è valido.')
    .custom((value, { req: { params: { id } } }) => User.findByEmail(value)
      .then(user => {
        if (!user || String(user.id) !== id) {
          return Promise.reject(new Error('L\'indirizzo email è già in uso.'))
        }
      }))
    .trim()
    .escape(),
  // body('passwords.new')
  //   .not().isEmpty().withMessage('La password è obbligatoria.'),
  checkErrors,
  asyncMiddleware(patchUser))

router.delete('/:id',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(deleteUser))

router.delete('/:id/documents',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(deleteDocumentsByUser))

router.get('/search/partial/:query',
  authenticate,
  logged,
  param('query')
    .trim()
    .escape(),
  checkErrors,
  asyncMiddleware(searchUser))

router.get('/:id/documents/:visibility',
  authenticate,
  logged,
  checkUserById,
  param('visibility')
    .custom(value => DocumentVisibility.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('La visibilità non esiste.'))
        }
      })),
  checkErrors,
  asyncMiddleware(getDocumentsOnVisibility))

router.get('/:id/documents/count/:visibility',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(countDocumentsOnVisibility))

router.patch('/:id/pic/',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  upload,
  asyncMiddleware(patchPicOfUser))

router.get('/:id/keys',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(getKeys))

module.exports = router
