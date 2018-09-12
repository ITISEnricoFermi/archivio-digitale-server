const express = require('express')
const router = express.Router()
const _ = require('lodash')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const fsPromises = fs.promises
const sharp = require('sharp')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(__dirname, '..', '..', '..', '..', 'public', 'pics', String(req.user._id))
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, String(req.user._id) + '.jpeg')
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
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Models
const {
  User
} = require('../../../../models/user')

const {
  Document
} = require('../../../../models/document')

/*
 * Utente loggato
 */
router.get('/me/', authenticate, asyncMiddleware(async (req, res) => {
  let user = _.pick(req.user, ['_id', 'firstname', 'lastname', 'email', 'accesses', 'privileges'])

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
    .sort({
      _id: 1
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
  let body = req.body.user

  // TODO: Verifica dei criteri
  // if (validator.isEmpty(user.passwords.new) || user.passwords.new.length < 6) {
  //   req.messages.push('Password non valida o troppo breve. (min. 6).')
  // } else if (user.passwords.old === user.passwords.new) {
  //   req.messages.push('La password attuale è uguale a quella nuova.')
  // } else if (!await User.findByCredentials(req.user.email, user.passwords.old)) {
  //   req.messages.push('La password attuale non è corretta.')
  // } else {
  //   user.password = user.passwords.new
  //   delete user.passwords
  // }

  if (body.password) {
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(body.password, salt)
    body.password = hash
  }

  let user = await User.findOneAndUpdate({
    _id: req.user._id
  }, {
    $set: {
      email: body.email,
      password: body.password
    }
  })

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

  const sizes = [{
    path: 'xlg',
    xy: 1200
  }, {
    path: 'lg',
    xy: 800
  }, {
    path: 'md',
    xy: 500
  }, {
    path: 'sm',
    xy: 300
  }, {
    path: 'xs',
    xy: 100
  }]

  for (let i = 0; i < sizes.length; i++) {
    await sharp(file.path).resize(sizes[i].xy, sizes[i].xy).toFormat('jpeg').toFile(path.join(file.destination, sizes[i].path + '.jpeg'))
  }

  await fsPromises.unlink(path.join(__dirname, '..', '..', '..', '..', 'public', 'pics', String(req.user._id), String(req.user._id) + '.jpeg'))

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
  await user.save()
  res.status(200).clearCookie('token').send({
    messages: ['Utente disabilitato con successo.']
  })
}))

/*
 * Utente loggato
 */
router.post('/search/partial/', authenticate, asyncMiddleware(async (req, res) => {
  let query = req.body.query
  let regex = query.split(' ').join('|')

  let users = await User.find({
    $and: [{
      $or: [{
        firstname: {
          $regex: regex,
          $options: 'i'
        }
      }, {
        lastname: {
          $regex: regex,
          $options: 'i'
        }
      }]
    }, {
      _id: {
        $ne: req.user._id
      }
    }]
  }, {
    accesses: false,
    privileges: false,
    state: false,
    email: false,
    password: false,
    __v: false
  }).limit(10)

  res.status(200).json(users)
}))

/*
 Utente loggato
 */
router.post('/me/logged', authenticate, (req, res) => {
  res.status(200).send()
})

module.exports = router
