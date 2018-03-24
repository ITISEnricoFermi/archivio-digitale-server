// Models
const {
  Document
} = require('../models/document')

const {
  DocumentCollection
} = require('../models/document_collection')

// Middleware
const {
  asyncMiddleware
} = require('./async')

let editDocument = asyncMiddleware(async (req, res, next) => {
  let document = await Document.findById(req.params.id)

  if (!document) {
    return res.status(400).send({
      messages: ['Il documento non esiste.']
    })
  }

  if (document.author._id === req.user._id || req.user.privileges === 'admin') {
    return next()
  } else {
    return res.status(401).send({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }
})

let editCollection = asyncMiddleware(async (req, res, next) => {
  let collection = await DocumentCollection.findById(req.params.id)

  if (!collection) {
    return res.status(400).send({
      messages: ['La collezione non esiste.']
    })
  }

  if (collection.author._id === req.user._id || req.user.privileges === 'admin') {
    return next()
  } else {
    return res.status(401).send({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }
})

module.exports = {
  editDocument,
  editCollection
}
