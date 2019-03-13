const express = require('express')
const router = express.Router()
const path = require('path')
const _ = require('lodash')

// Middleware

const {
  asyncMiddleware
} = require('../middlewares/async')

// Models
const {
  Document
} = require('../models/document')

router.get('/documents/*', asyncMiddleware(async (req, res, next) => {
  let directory = req.url.split(path.sep)[2]
  let document = (await Document.find({
    directory
  }))[0]

  if (!document) {
    return res.status(404).send({
      messages: ['Il documento non esiste.']
    })
  }
  // TODO: Accesso da parte di loggati e non
  if (document.visibility._id !== 'pubblico') {
    return res.status(401).send({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}))

router.post('/search/documents/', asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body, ['fulltext', 'type', 'faculty', 'subject', 'grade', 'section'])
  let empty = _.every(body, (el) => {
    return !el
  })

  if (empty) {
    return res.status(500).json({
      messages: ['Nessuna query di ricerca.']
    })
  }

  let documents = await Document.searchPublicDocuments(body, req.user)
  if (documents.length) {
    return res.status(200).json(documents)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}))

router.get('/recent/:type', asyncMiddleware(async (req, res) => {
  let documents = await Document.find({
    visibility: 'pubblico',
    type: req.params.type
  })
    .sort({
      _id: -1
    })
    .limit(9)
  if (documents.length) {
    res.status(200).json(documents)
  } else {
    res.status(404).json({
      messages: ['Nessun documento presente.']
    })
  }
}))

module.exports = router
