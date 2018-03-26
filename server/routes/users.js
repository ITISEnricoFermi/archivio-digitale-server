const express = require('express')
const router = express.Router()
const _ = require('lodash')
const validator = require('validator')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'pics'))
  },
  filename: function (req, file, cb) {
    cb(null, String(req.user._id) + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 2 // 2 MB
}

const upload = multer({
  storage,
  limits,
  fileFilter
})

// Middleware
const {
  authenticate
} = require('./../middleware/authenticate')

const {
  asyncMiddleware
} = require('../middleware/async')

// Models
const {
  User
} = require('./../models/user')

const {
  Document
} = require('./../models/document')

/*
 * Utente loggato
 */
router.get('/me/', authenticate, asyncMiddleware(async (req, res) => {
  let user = _.pick(req.user, ['_id', 'firstname', 'lastname', 'email', 'accesses', 'privileges', 'img'])

  let documents = await Document.count({
    author: user._id
  })

  user.documents = documents
  res.status(200).send(user)
}))

/*
 * Utente loggato
 */
router.get('/me/documents/:visibility', authenticate, asyncMiddleware(async (req, res) => {
  let documents = await Document.find({
    author: req.user._id,
    visibility: req.params.visibility
  })
    .populate('author', 'firstname lastname img')
    .populate('type')
    .populate('faculty')
    .populate('subject')
    .populate('class')
    .populate('section')
    .sort({
      _id: 1
    })

  return res.status(200)
    .header('x-userid', req.user._id)
    .header('x-userprivileges', req.user.privileges)
    .send(documents)
}))

/*
 * Utente loggato
 */
router.get('/me/documents/count/:visibility', authenticate, asyncMiddleware(async (req, res) => {
  let documents = await Document.count({
    author: req.user._id,
    visibility: req.params.visibility
  })
  res.status(200).send(documents.toString())
}))

/*
 * Utente loggato
 */
router.patch('/me/', authenticate, asyncMiddleware(async (req, res) => {
  var body = _.pick(req.body, ['old', 'new'])

  let user = await User.findByCredentials(req.user.email, body.old)

  if (validator.isEmpty(body.new) || body.new.length < 6) {
    return res.status(400).send('Password non valida o troppo breve. (min. 6).')
  } else if (body.old === body.new) {
    return res.status(400).send('La password attuale è uguale a quella nuova.')
  }

  user.password = body.new
  user.tokens = []
  await user.save()
  res.status(200).send(user)
}))

/*
 * Utente loggato
 */
router.patch('/me/pic/', authenticate, upload.single('picToUpload'), asyncMiddleware(async (req, res) => {
  let file = req.file

  if (!file) {
    return res.status(400).send({
      messages: ['Nessun file caricato.']
    })
  }

  let user = await User.findById(req.user._id)

  user.img = file.filename
  await user.save()
  res.status(200).send({
    messages: ['Immagine di profilo aggiornata con successo.']
  })
}))

/*
 * Utente loggato
 */
router.delete('/me/', authenticate, asyncMiddleware(async (req, res) => {
  let user = await User.findById(req.user._id)
  user.state = 'disabled'
  user.tokens = []
  await user.save()
  res.status(200).clearCookie('token').send({
    messages: ['Utente disabilitato con successo.']
  })
}))

/*
 Utente loggato
 */
router.post('/me/logged', authenticate, (req, res) => {
  res.status(200).send()
})

module.exports = router
