const _ = require('lodash')
const fs = require('fs')

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
  const stat = await minioClient.statObject('documents', id)
  const mime = stat.metaData['content-type']
  document.mimetype = mime

  res.status(200).json(document)
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

const deleteDocument = async ({ params: { id } }, res) => {
  try {
    await Promise.all([Document.findByIdAndRemove(id),
      DocumentCollection.updateOne({
        documents: [id]
      }, {
        $pull: {
          documents: [id]
        }
      })])

    await minioClient.removeObject('documents', id)

    res.status(200).json({
      messages: ['Documento eliminato correttamente.']
    })
  } catch (e) {
    throw new Error('Impossibile eliminare il documento.')
  }
}

const getCollectionsOnDocument = async ({ params: { id } }, res) => {
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

const partialSearchDocuments = async ({ query: { fulltext, page, perPage } }, res) => {
  let find
  const skip = perPage * page - perPage
  perPage = parseInt(perPage)
  page = parseInt(page)

  if (!fulltext) {
    find = {}
  } else {
    const regex = fulltext.split(' ').join('|')
    find = {
      name: {
        $regex: regex,
        $options: 'i'
      }
    }
  }

  const [documents, count] = await Promise.all([Document.find(find, {
    type: false,
    faculty: false,
    subject: false,
    visibility: false,
    description: false,
    // author: false,
    directory: false,
    __v: false
  }).limit(perPage)
    .skip(skip),
  Document.countDocuments(find)])

  const pages = Math.ceil(count / perPage)

  res.status(200).json({
    documents,
    page,
    pages,
    total: count
  })
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

const transferDocuments = async ({ body: { documents, to, type }, user }, res) => {
  let filter = {}

  switch (type) {
    case 'selected':

      if (!documents.length) {
        return res.status(400).json({
          messages: ['Non sono stati specificati i documenti.']
        })
      }
      for (let i = 0; i < documents.length; i++) {
        if (!Document.isEditable(documents[i], user)) {
          return res.status(401).json({
            messages: ['Non si detengono i privilegi necessari.']
          })
        }
      }

      filter._id = {
        $in: documents
      }
      break
    case 'all':
      filter.author = user._id
      break
    default:
      return res.status(500).json({
        messages: ['Il tipo di operazione non esiste.']
      })
  }

  try {
    await Document.updateMany(filter, {
      author: to[0]
    })
  } catch (e) {
    return res.status(500).json({
      messages: ['Impossibile trasferire i documenti.']
    })
  }

  res.status(200).json({
    messages: ['Documenti trasferiti.']
  })
}

module.exports = {
  getDocument,
  postDocument,
  patchDocument,
  deleteDocument,
  searchDocument,
  transferDocuments,
  getRecentDocuments,
  deleteDocumentsByUser,
  partialSearchDocuments,
  getCollectionsOnDocument
}
