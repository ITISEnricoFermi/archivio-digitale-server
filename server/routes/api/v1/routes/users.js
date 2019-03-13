const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {
  check,
  body,
  param
} = require('express-validator/check')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(process.env.root, 'public', 'pics', String(req.user._id))
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, String(req.user._id) + '.jpeg')
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 2 // 2 MB
}

const upload = multer({
  storage,
  limits,
  fileFilter
})

const {
  User
} = require('../../../../models/user')

const {
  DocumentVisibility
} = require('../../../../models/document_visibility')

// Middleware
const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const checkErrors = require('../../../../middlewares/check')

const {
  getUser,
  patchUser,
  deleteUser,
  searchUser,
  getDocumentsOnVisibility,
  countDocumentsOnVisibility,
  patchPicOfUser
} = require('../../../../controllers/users')

router.get('/:id',
  authenticate,
  param('id')
    .isMongoId().withMessage('ID non valido.')
    .custom(value => User.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('Utente non presente.'))
        }
      })),
  checkErrors,
  asyncMiddleware(getUser))

router.patch('/:id',
  authenticate,
  param('id')
    .isMongoId().withMessage('ID non valido.')
    .custom(value => User.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('Utente non presente.'))
        }
      })),
  checkErrors,
  asyncMiddleware(patchUser))

router.delete('/:id',
  authenticate,
  param('id')
    .isMongoId().withMessage('ID non valido.')
    .custom(value => User.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('Utente non presente.'))
        }
      })),
  checkErrors,
  asyncMiddleware(deleteUser))

router.get('/search/partial/:query',
  authenticate,
  param('query')
    .trim()
    .escape(),
  checkErrors,
  asyncMiddleware(searchUser))

router.get('/:id/documents/:visibility', authenticate,
  param('id')
    .isMongoId().withMessage('ID non valido.')
    .custom(value => User.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('Utente non presente.'))
        }
      })),
  param('visibility')
    .custom(value => DocumentVisibility.findById(value)
      .then(id => {
        if (!id) {
          return Promise.reject(new Error('La visibilità non esiste.'))
        }
      })), asyncMiddleware(getDocumentsOnVisibility))

router.get('/:id/documents/count/:visibility', authenticate, asyncMiddleware(countDocumentsOnVisibility))
router.patch('/:id/pic/', authenticate, upload.single('picToUpload'), asyncMiddleware(patchPicOfUser))

module.exports = router
