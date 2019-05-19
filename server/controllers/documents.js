const _ = require('lodash')
const mongoose = require('mongoose')
const fs = require('fs')

const {
  ObjectId
} = mongoose.Types

const uploader = require('../lib/uploader')
const minioClient = require('../lib/minio')

// Models
const {
  Document
} = require('../models/document')

const {
  DocumentCollection
} = require('../models/document_collection')

const getDocument = async ({ params: { id }, user }, res) => {
  let document = await Document.findById(id).lean()
  document = Document.isEditable(document, user)
  const collection = await DocumentCollection.findOne({
    documents: id
  })
  document.collection = collection
  res.status(200).json({
    ...document,
    ...collection
  })
}

const postDocument = async ({ file, user, body }, res) => {
  body = _.pick(body, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  // Validazione
  if (!file) {
    return res.status(400).json({
      messages: ['Nessun file caricato.']
    })
  }

  body.author = String(user._id)
  body.mimetype = file.mimetype
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)

  const document = new Document(body)
  await document.validate()

  const mimetypes = require('../config/mimetypes/mimetypes')
  const store = uploader(file.mimetype, mimetypes)
  const master = fs.createReadStream(file.path)
  await store.upload('documents', document.id, master)

  if (await document.save()) {
    res.status(201).json(document)
  }
}

const patchDocument = async ({ params: { id }, body }, res) => {
  // NEW
  // let { name, type, faculty, subject, grade, section, visibility, description } = req.body

  body = _.pick(body, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  // Formattazione
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)

  const document = await Document.findByIdAndUpdate(id, {
    $set: body
  })

  if (document) {
    return res.status(200).json({
      messages: ['Documento modificato con successo.']
    })
  }
}

const deleteDocument = async ({ params: id }, res) => {
  try {
    await Document.findByIdAndRemove(id)
    await DocumentCollection.updateOne({
      documents: ObjectId(id)
    }, {
      $pull: {
        documents: ObjectId(id)
      }
    })

    await minioClient.removeObject('documents', id)

    res.status(200).json({
      messages: ['Documento eliminato correttamente.']
    })
  } catch (e) {
    throw new Error('Impossibile eliminare il documento.')
  }
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

  const empty = Object.values(body).every(el => !el)

  if (empty) {
    return res.status(500).send({
      messages: ['Nessuna query di ricerca.']
    })
  }

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

const getRecentDocuments = async ({ params: { page, number, type }, user }, res) => {
  const documents = await Document.getRecentDocuments(page, number, type, user)

  if (documents.length) {
    res.status(200).json(documents)
  } else {
    res.status(404).json({
      messages: ['Nessun documento presente.']
    })
  }
}

const partialSearchDocuments = async ({ params: { query } }, res) => {
  console.log(query)
  const regex = query.split(' ').join('|')

  const documents = await Document.find({
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

const deleteDocumentsByUser = async ({ params: { id }, user }, res) => {
  const isAdmin = user.privileges._id === 'admin'
  const isAuthor = user._id === id

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
