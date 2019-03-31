const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const mongoose = require('mongoose')

const {
  ObjectId
} = mongoose.Types

const uploader = require('../lib/uploader')

// Models
const {
  Document
} = require('../models/document')

const {
  DocumentCollection
} = require('../models/document_collection')

const getDocument = async (req, res) => {
  const id = req.params.id
  let document = await Document.findById(id).lean()
  document = Document.isEditable(document, req.user)
  const collection = await DocumentCollection.findOne({
    documents: id
  })
  document.collection = collection
  res.status(200).json({
    ...document,
    ...collection
  })
}

const postDocument = async (req, res) => {
  let body = _.pick(req.body, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  // Validazione
  if (!req.file) {
    return res.status(500).json({
      messages: ['Nessun file caricato.']
    })
  }

  // Formattazione
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)
  body.author = String(req.user._id)
  body.mimetype = req.file.mimetype

  const document = new Document(body)

  const store = uploader(req, res)
  await store.upload('documents', document.id)

  if (await document.save()) {
    res.status(201).json(document)
  }
}

const patchDocument = async (req, res) => {
  const id = req.params.id

  //
  // // NEW
  // let { name, type, faculty, subject, grade, section, visibility, description } = req.body.document
  //
  // // Formattazione
  // name = _.upperFirst(name)
  // description = _.upperFirst(description)

  // OLD

  let body = _.pick(req.body, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  // Formattazione
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)

  let document = await Document.findByIdAndUpdate(id, {
    $set: body
  })

  if (document) {
    return res.status(200).json({
      messages: ['Documento modificato con successo.']
    })
  }
}

const deleteDocument = async (req, res) => {
  const { id } = req.params
  let document = await Document.findByIdAndRemove(id)
  await DocumentCollection.updateOne({
    documents: ObjectId(id)
  }, {
    $pull: {
      documents: ObjectId(id)
    }
  })

  fs.unlink(path.join(process.env.root, 'public', 'public', 'documents', document.directory), (err) => {
    if (err) {
      return res.status(500).json({
        messages: ['Impossibile eliminare il documento.']
      })
    }
    res.status(200).json({
      messages: ['Documento eliminato correttamente.']
    })
  })
}

const getCollectionsOnDocument = async (req, res) => {
  const id = req.params.id

  const collections = await DocumentCollection.find({
    documents: id
  })

  res.status(200).json(collections)
}

const searchDocument = async (req, res) => {
  const body = _.pick(req.body, ['fulltext', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility'])

  let documents = await Document.searchDocuments(body, req.user)
  documents.map(document => Document.isEditable(document, req.user))

  if (documents.length) {
    res.status(200).send(documents)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}

const getRecentDocuments = async (req, res) => {
  const { page, number, type } = req.params

  const documents = await Document.getRecentDocuments(page, number, type, req.user)

  if (documents.length) {
    res.status(200).json(documents)
  } else {
    res.status(404).json({
      messages: ['Nessun documento presente.']
    })
  }
}

const partialSearchDocuments = async (req, res) => {
  let query = req.body.query
  let regex = query.split(' ').join('|')

  let documents = await Document.find({
    name: {
      $regex: regex,
      $options: 'i'
    }
  }, {
    type: false,
    faculty: false,
    subject: false,
    visibility: false,
    description: false,
    author: false,
    directory: false,
    __v: false
  }).limit(10)

  res.status(200).json(documents)
}

const deleteDocumentsByUser = async (req, res) => {
  const { id } = req.params

  const isAdmin = req.user.privileges._id === 'admin'
  const isAuthor = req.user._id === id

  if (!isAdmin && !isAuthor) {
    return res.status(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  const counts = await Document.deleteMany({
    author: id
  })

  res.status(404).json({
    counts
  })
}

module.exports = {
  getDocument,
  patchDocument,
  postDocument,
  deleteDocument,
  searchDocument,
  getRecentDocuments,
  partialSearchDocuments,
  getCollectionsOnDocument,
  deleteDocumentsByUser
}
