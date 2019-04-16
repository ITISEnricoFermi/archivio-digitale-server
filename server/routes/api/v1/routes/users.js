const express = require('express')
const router = express.Router()

const {
  param
} = require('express-validator/check')

const {
  DocumentVisibility
} = require('../../../../models/document_visibility')

// Middleware
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

const {
  getUser,
  patchUser,
  deleteUser,
  searchUser,
  getDocumentsOnVisibility,
  countDocumentsOnVisibility,
  patchPicOfUser,
  deleteDocumentsByUser
} = require('../../../../controllers/users')

router.get('/:id',
  authenticate,
  logged,
  checkUserById,
  checkErrors,
  asyncMiddleware(getUser))

router.patch('/:id',
  authenticate,
  logged,
  checkUserById,
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

module.exports = router
