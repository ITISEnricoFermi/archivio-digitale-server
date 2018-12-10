const express = require('express')
const router = express.Router()
const _ = require('lodash')

// Middleware
const {
  authenticate
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

const {
  editCollection
} = require('../../../../middleware/edit')

// Models
const {
  DocumentCollection
} = require('../../../../models/document_collection')

router.get('/info/:id', authenticate, asyncMiddleware(async (req, res) => {
  let collection = await DocumentCollection.findById(req.params.id)
  res.status(200).send(collection)
}))

/*
 * Utente loggato
 */
router.put('/', authenticate, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body, ['documentCollection', 'permissions', 'authorizations'])

  // Formattazione
  body.author = req.user._id

  if (body.permissions !== 'utenti') {
    body.authorizations = []
  }

  // TODO: Permessi collezioni in base alla scelta
  // if ((collection.permissions === 'utenti') && (collection.authorizations !== null || collection.authorizations.length > 0)) {
  //   let authorizations = await User.count({
  //     _id: {
  //       $in: collection.authorizations.map(authorization => authorization._id)
  //     }
  //   })
  //
  //   if (authorizations !== collection.authorizations.length) {
  //     req.messages.push('Una delle autorizzazioni non è valida.')
  //   }
  // }
  //

  let collection = new DocumentCollection(body)
  await collection.save()
  res.status(201).send({
    messages: ['Collezione creata con successo.']
  })
}))

router.patch('/:id', authenticate, editCollection, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body, ['documentCollection', 'permissions', 'authorizations', 'documents'])
  const id = req.params.id

  if (body.permissions !== 'utenti') {
    body.authorizations = []
  }

  body.documents = body.documents.map(document => document._id)

  let collection = await DocumentCollection.findByIdAndUpdate(id, {
    $set: body
  })

  if (collection) {
    return res.status(200).json({
      messages: ['Collezione modificata con successo.']
    })
  }
}))

/*
 * Utente loggato
 */
router.delete('/:id', authenticate, editCollection, asyncMiddleware(async (req, res) => {
  const id = req.params.id
  let collection = await DocumentCollection.findByIdAndRemove(id)

  if (collection) {
    return res.status(200).json({
      messages: ['Collezione eliminata correttamente.']
    })
  }
}))

router.post('/search/', authenticate, asyncMiddleware(async (req, res) => {
  var body = _.pick(req.body, ['fulltext', 'permissions'])

  var empty = _.every(body, (el) => {
    return !el
  })

  if (empty) {
    return res.status(500).send({
      messages: ['Nessuna query di ricerca.']
    })
  }

  let collections = await DocumentCollection.searchCollections(body, req.user)

  if (collections.length) {
    res.status(200).send(collections)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}))

module.exports = router
