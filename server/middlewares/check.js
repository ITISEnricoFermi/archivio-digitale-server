const {
  validationResult,
  param
} = require('express-validator')

const {
  User
} = require('../models/user')

const {
  Document
} = require('../models/document')

const {
  DocumentCollection
} = require('../models/document_collection')

const checkErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors.array().map(el => el.msg) })
  }

  return next()
}

const checkUserById = param('id')
  .isMongoId().withMessage('ID non valido.')
  .custom(value => User.findById(value)
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('L\'utente non esiste.'))
      }
    }))

const checkDocumentById = param('id')
  .isMongoId().withMessage('ID non valido.')
  .custom(value => Document.findById(value)
    .then(document => {
      if (!document) {
        return Promise.reject(new Error('Il documento non esiste.'))
      }
    }))

const checkDocumentEditableById = param('id')
  .custom((value, { req }) => Document.findById(value)
    .then(document => {
      if (!Document.isEditable(document, req.user)) {
        return Promise.reject(new Error('Non si detengono i privilegi necessari.'))
      }
    }))

const checkDocumentReadableById = param('id')
  .custom((value, { req }) => Document.findById(value)
    .then(document => {
      if (!Document.isReadable(document, req.user)) {
        return Promise.reject(new Error('Non si detengono i privilegi necessari.'))
      }
    }))

const checkCollectionById = param('id')
  .isMongoId().withMessage('ID non valido.')
  .custom(value => DocumentCollection.findById(value)
    .then(collection => {
      if (!collection) {
        return Promise.reject(new Error('La collezione non esiste.'))
      }
    }))

const checkCollectionEditableById = param('id')
  .custom((value, { req }) => DocumentCollection.findById(value)
    .then(collection => {
      if (!DocumentCollection.isEditable(collection, req.user)) {
        return Promise.reject(new Error('Non si detengono i privilegi necessari.'))
      }
    }))

// TODO: User non è nel body
// const checkAdminById = check('user')
//   .custom(value => {
//     console.log(value)
//     if (value.privileges._id !== 'admin') {
//       return Promise.reject(new Error('Non si detengono i privilegi necessari.'))
//     }
//   })

const checkAdminById = (req, res, next) => {
  if (req.user.privileges._id !== 'admin') {
    return res.status(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}

module.exports = {
  checkErrors,
  checkUserById,
  checkDocumentById,
  checkDocumentEditableById,
  checkCollectionById,
  checkCollectionEditableById,
  checkDocumentReadableById,
  checkAdminById
}
