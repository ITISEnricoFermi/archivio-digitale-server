const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const _ = require('lodash')
const multer = require('multer')
const validator = require('validator')
const path = require('path')
const fs = require('fs')

const {
  ObjectId
} = mongoose.Types

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require('./../middleware/authenticate')

const {
  asyncMiddleware
} = require('../middleware/async')

const {
  editDocument
} = require('../middleware/edit')

const {
  checkDocument,
  checkErrors
} = require('../middleware/check')

// Models
const {
  Document
} = require('./../models/document')

const {
  DocumentCollection
} = require('./../models/document_collection')

const {
  DocumentType
} = require('../models/document_type')

const {
  Faculty
} = require('../models/faculty')

const {
  Subject
} = require('../models/subject')

const {
  DocumentVisibility
} = require('../models/document_visibility')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'public', 'documents'))
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + path.extname(file.originalname))
  }
})

const fileFilter = asyncMiddleware(async (req, file, cb) => {
  let document = _.pick(JSON.parse(req.body.document), ['name', 'type', 'faculty', 'subject', 'visibility', 'description'])
  let pass = null

  if (document.name == null || document.name.length < 1) {
    return cb(new Error('Il campo del nome è vuoto.'), false)
  }

  if (document.description == null || document.description < 1) {
    cb(new Error('Il campo della descrizione è vuoto.'), false)
  }

  if (document.type == null || document.type.length < 1) {
    return cb(new Error('Il campo del tipo è vuoto.'), false)
  } else {
    pass = await DocumentType.findById(document.type)
    if (!pass) {
      cb(new Error('Il tipo non è valido.'), false)
    }
  }

  if (document.faculty == null || document.faculty.length < 1) {
    cb(new Error('Il campo della specializzazione è vuoto.'), false)
  } else {
    pass = await Faculty.findById(document.faculty)
    if (!pass) {
      cb(new Error('La specializzazione non è valida.'), false)
    }
  }

  if (document.subject == null || document.subject.length < 1) {
    cb(new Error('Il campo della materia è vuoto.'), false)
  } else {
    pass = await Subject.findById(document.subject)
    if (!pass) {
      cb(new Error('La materia non è valida.'), false)
    }
  }

  if (document.visibility == null || document.visibility.length < 1) {
    cb(new Error('Il campo della visibilità è vuoto.'), false)
  } else {
    pass = await DocumentVisibility.findById(document.visibility)
    if (!pass) {
      cb(new Error('La visibilità non è valida.'), false)
    }
  }

  req.body.document = document

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
  console.log('Ciao')
  let body = _.pick(req.body.document, ['name', 'type', 'faculty', 'subject', 'class', 'section', 'visibility', 'description'])

  // Validazione
  if (!req.file) {
    return res.status(500).json({
      messages: ['Nessun file caricato.']
    })
  }

  // Formattazione
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)
  body.author = req.user._id
  body.directory = req.file.filename

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
router.patch('/:id', authenticate, editDocument, checkDocument, checkErrors, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.document, ['name', 'type', 'faculty', 'subject', 'class', 'section', 'visibility', 'description'])

  // Formattazione
  body.name = _.upperFirst(body.name)
  body.description = _.upperFirst(body.description)

  let document = await Document.findByIdAndUpdate(req.params.id, {
    $set: body
  })

  if (document) {
    return res.status(200).json({
      messages: ['Documento modificato con successo.']
    })
  }
}))

/*
 * Utente loggato
 * Utente proprietario o admin
 */
router.delete('/:id', authenticate, editDocument, asyncMiddleware(async (req, res) => {
  let document = await Document.findByIdAndRemove(req.params.id)

  await DocumentCollection.update({
    documents: ObjectId(req.params.id)
  }, {
    $pull: {
      documents: ObjectId(req.params.id)
    }
  })

  fs.unlink(path.join(__dirname, '..', 'public', 'public', 'documents', document.directory), function (err) {
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
  var body = _.pick(req.body, ['fulltext', 'type', 'faculty', 'subject', 'class', 'section', 'visibility'])
  var empty = _.every(body, (el) => {
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

router.get('/recent/', authenticate, asyncMiddleware(async (req, res) => {
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
    .limit(3)
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
    res.status(200).json({
      messages: ['Nessun documento presente.']
    })
  }
}))

module.exports = router
