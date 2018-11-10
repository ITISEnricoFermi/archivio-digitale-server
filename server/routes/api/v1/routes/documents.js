const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const _ = require('lodash')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {
  ObjectId
} = mongoose.Types

// Middleware
const {
  authenticate
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

const {
  editDocument
} = require('../../../../middleware/edit')

// Models
const {
  Document
} = require('../../../../models/document')

const {
  DocumentCollection
} = require('../../../../models/document_collection')

// const {
//   DocumentType
// } = require('../../../../models/document_type')
//
// const {
//   Faculty
// } = require('../../../../models/faculty')
//
// const {
//   Subject
// } = require('../../../../models/subject')
//
// const {
//   DocumentVisibility
// } = require('../../../../models/document_visibility')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', '..', '..', 'public', 'public', 'documents'))
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + path.extname(file.originalname))
  }
})

const fileFilter = asyncMiddleware(async (req, file, cb) => {
  req.body.document = _.pick(JSON.parse(req.body.document), ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  const mimeypes = ['audio/aac', 'video/x-msvideo', 'text/csv', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip', 'image/gif', 'image/x-icon', 'image/jpeg', 'audio/midi',
    'video/mpeg', 'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.text',
    'audio/ogg', 'video/ogg', 'application/ogg', 'image/png', 'application/pdf',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-rar-compressed', 'application/rtf', 'application/x-tar', 'image/tiff', 'application/vnd.visio',
    'audio/x-wav', 'audio/webm', 'video/webm', 'image/webp', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/x-7z-compressed', 'text/plain'
  ]

  if (mimeypes.indexOf(file.mimetype) === -1 && !(new RegExp('^' + 'video/', 'i')).test(file.mimetype)) {
    cb(new Error('Il formato del file non è valido.'), false) // Il file usa un formato non ammesso
  } else {
    cb(null, true) // Il file usa un formato permesso
  }
})

const limits = {
  fileSize: 1024 * 1024 * 100 // 100 MB
}

const upload = multer({
  storage,
  limits,
  fileFilter
}).single('file')

router.get('/info/:id', authenticate, asyncMiddleware(async (req, res) => {
  let document = await Document.findById(req.params.id).lean()
  let collection = await DocumentCollection.findOne({
    documents: req.params.id
  })
  document.collection = collection
  res.status(200).send(document)
}))

/*
 * Utente loggato
 */
router.put('/', authenticate, upload, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.document, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

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
  body.directory = req.file.filename
  body.mimetype = req.file.mimetype

  let document = new Document(body)

  document = await document.save()
  if (document) {
    res.status(201).send(document)
  }
}))

/*
 * Utente loggato
 * Utente proprietario o admin
 */
router.patch('/:id', authenticate, editDocument, asyncMiddleware(async (req, res) => {
  const id = req.params.id

  //
  // // NEW
  // let { name, type, faculty, subject, grade, section, visibility, description } = req.body.document
  //
  // // Formattazione
  // name = _.upperFirst(name)
  // description = _.upperFirst(description)

  // OLD

  let body = _.pick(req.body.document, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

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
}))

router.get('/:id/collections', authenticate, asyncMiddleware(async (req, res) => {
  const {id} = req.params

  const collections = await DocumentCollection.find({
    documents: id
  })

  res.status(200).json(collections)
}))

/*
 * Utente loggato
 * Utente proprietario o admin
 */
router.delete('/:id', authenticate, editDocument, asyncMiddleware(async (req, res) => {
  const { id } = req.params
  let document = await Document.findByIdAndRemove(id)
  await DocumentCollection.updateOne({
    documents: ObjectId(id)
  }, {
    $pull: {
      documents: ObjectId(id)
    }
  })

  fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'public', 'public', 'documents', document.directory), (err) => {
    if (err) {
      return res.status(500).json({
        messages: ['Impossibile eliminare il documento.']
      })
    }
    res.status(200).json({
      messages: ['Documento eliminato correttamente.']
    })
  })
}))

router.post('/search/', authenticate, asyncMiddleware(async (req, res) => {
  var body = _.pick(req.body, ['fulltext', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility'])
  let empty = _.every(body, (el) => {
    return !el
  })

  if (empty) {
    return res.status(500).json({
      messages: ['Nessuna query di ricerca.']
    })
  }

  let documents = await Document.searchDocuments(body, req.user)

  if (documents.length) {
    res.status(200).send(documents)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}))

router.get('/recent/:page/:number', authenticate, asyncMiddleware(async (req, res) => {
  const { page, number } = req.params

  if (req.user.privileges === 'user') {
    var query = {
      $or: [{
        visibility: 'pubblico'
      }, {
        visibility: 'areariservata'
      }, {
        $and: [{
          visibility: 'materia'
        }, {
          subject: {
            $in: req.user.accesses
          }
        }]
      }]
    }
  }

  let documents = await Document.find(query || {})
    .skip(Number(page) > 0 ? ((Number(page) - 1) * Number(number)) : 0)
    .limit(Number(number))
    .sort({
      _id: -1
    })
    .lean()

  if (documents.length) {
    for (let i = 0; i < documents.length; i++) {
      if (String(documents[i].author._id) === String(req.user._id) || req.user.privileges._id === 'admin') {
        documents[i].own = true
      }
    }

    res.status(200).send(documents)
  } else {
    res.status(404).json({
      messages: ['Nessun documento presente.']
    })
  }
}))

router.post('/search/partial/', authenticate, asyncMiddleware(async (req, res) => {
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
}))

module.exports = router
