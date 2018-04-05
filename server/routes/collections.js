const express = require('express')
const router = express.Router()
const _ = require('lodash')

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require('./../middleware/authenticate')

const {
  asyncMiddleware
} = require('../middleware/async')

const {
  editCollection
} = require('../middleware/edit')

const {
  checkCollection,
  checkErrors
} = require('../middleware/check')

// Models
const {
  DocumentCollection
} = require('./../models/document_collection')

router.get('/info/:id', authenticate, asyncMiddleware(async (req, res) => {
  let collection = await DocumentCollection.findById(req.params.id)
  res.status(200).send(collection)
}))

/*
 * Utente loggato
 */
router.put('/', authenticate, checkCollection, checkErrors, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.collection, ['documentCollection', 'permissions', 'authorizations'])

  // Formattazione
  body.author = req.user._id

  if (body.permissions !== 'utenti') {
    body.authorizations = []
  }

  let collection = new DocumentCollection(body)
  await collection.save()
  res.status(201).send({
    messages: ['Collezione creata con successo.']
  })
}))

router.patch('/:id', authenticate, editCollection, checkCollection, checkErrors, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.collection, ['documentCollection', 'permissions', 'authorizations', 'documents'])

  if (body.permissions !== 'utenti') {
    body.authorizations = []
  }

  body.documents.filter(document => document._id)

  let collection = await DocumentCollection.findByIdAndUpdate(req.params.id, {
    $set: body
  })

  if (collection) {
    return res.status(200).send({
      messages: ['Collezione modificata con successo.']
    })
  }
}))

/*
 * Utente loggato
 */
router.delete('/:id', authenticate, editCollection, asyncMiddleware(async (req, res) => {
  let collection = await DocumentCollection.findByIdAndRemove(req.params.id)

  if (collection) {
    return res.status(200).send({
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
