const _ = require('lodash')

const {
  DocumentCollection
} = require('../models/document_collection')

const getCollection = async (req, res) => {
  let collection = await DocumentCollection.findById(req.params.id).lean()
  collection = DocumentCollection.isEditable(collection, req.user)
  res.status(200).send(collection)
}

const postCollection = async (req, res) => {
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
}

const patchCollection = async (req, res) => {
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
}

const deleteCollection = async (req, res) => {
  const id = req.params.id
  let collection = await DocumentCollection.findByIdAndRemove(id)

  if (collection) {
    return res.status(200).json({
      messages: ['Collezione eliminata correttamente.']
    })
  }
}

const searchCollections = async (req, res) => {
  const body = _.pick(req.body, ['fulltext', 'permissions'])

  const empty = _.every(body, (el) => {
    return !el
  })

  if (empty) {
    return res.status(500).send({
      messages: ['Nessuna query di ricerca.']
    })
  }

  let collections = await DocumentCollection.searchCollections(body, req.user)
  collections = collections.map(collection => DocumentCollection.isEditable(collection, req.user))

  if (collections.length) {
    res.status(200).send(collections)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}

module.exports = {
  getCollection,
  postCollection,
  patchCollection,
  deleteCollection,
  searchCollections
}
