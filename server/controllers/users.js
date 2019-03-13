const path = require('path')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const fsPromises = fs.promises
const sharp = require('sharp')

// Models
const {
  User
} = require('../models/user')

const {
  Document
} = require('../models/document')

const getUser = async (req, res) => {
  const id = req.params.id

  const {
    _id,
    firstname,
    lastname,
    email,
    state,
    accesses,
    privileges
  } = await User.findById(id)

  res.status(200).json({
    _id,
    firstname,
    lastname,
    email,
    state,
    accesses,
    privileges
  })
}

const patchUser = async (req, res) => {
  const id = req.params.id
  const body = req.body

  if (id !== req.user._id && req.user.privileges._id !== 'admin') {
    return res.status(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

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
    _id: id
  }, {
    $set: {
      email: body.email,
      password: body.password
    }
  })

  res.status(200).json(user)
}

const deleteUser = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)
  user.state = 'disabled'
  await user.save()
  res.status(200).clearCookie('token').json({
    messages: ['Utente disabilitato con successo.']
  })
}

const searchUser = async (req, res) => {
  let query = req.params.query
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
    }, {
      state: {
        $ne: 'pending'
      }
    }]
  }, {
    // email: false,
    password: false,
    __v: false
  }).limit(10)

  res.status(200).json(users)
}

const getDocumentsOnVisibility = async (req, res) => {
  const {id, visibility} = req.params
  const query = {
    author: id,
    visibility: visibility
  }

  if (req.user.privileges._id !== 'admin' && req.user._id !== id && visibility === 'materia') {
    query.subject = {
      $in: req.user.accesses
    }
  }

  let documents = await Document.find(query)
    .sort({
      _id: 1
    })
    .lean()

  documents.map(document => Document.isEditable(document, req.user))

  if (!documents.length) {
    return res.status(200).json({
      messages: ['Nessun documento presente.']
    })
  }

  // for (let i = 0; i < documents.length; i++) {
  //   if (String(documents[i].author._id) === String(req.user._id) || req.user.privileges._id === 'admin') {
  //     documents[i].own = true
  //   }
  // }

  res.status(200).json(documents)
}

const countDocumentsOnVisibility = async (req, res) => {
  const {id, visibility} = req.params
  const documents = await Document.countDocuments({
    author: id,
    visibility: visibility
  })
  res.status(200).send(documents.toString())
}

const patchPicOfUser = async (req, res) => {
  const id = req.params.id
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

  const pics = []

  for (let i = 0; i < sizes.length; i++) {
    pics.push(sharp(file.path)
      .resize(sizes[i].xy, sizes[i].xy)
      .toFormat('jpeg')
      .toFile(path.join(file.destination, sizes[i].path + '.jpeg')))
  }

  await Promise.all(pics)

  await fsPromises.unlink(path.join(process.env.root, 'public', 'pics', String(id), String(id) + '.jpeg'))

  res.status(200).send({
    messages: ['Immagine di profilo aggiornata con successo.']
  })
}

module.exports = {
  getUser,
  patchUser,
  deleteUser,
  searchUser,
  getDocumentsOnVisibility,
  countDocumentsOnVisibility,
  patchPicOfUser
}
