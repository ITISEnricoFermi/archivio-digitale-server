const bcrypt = require('bcryptjs')
const fs = require('fs')

// Models
const {
  User
} = require('../models/user')

const {
  Document
} = require('../models/document')

const uploader = require('../lib/uploader')

const getUser = async ({ params: { id } }, res) => {
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

const patchUser = async ({ params: { id }, body: { email, passwords }, user }, res) => {
  if (id !== user._id && user.privileges._id !== 'admin') {
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

  if (passwords.new) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(passwords.new, salt)
    passwords.new = hash
  }

  const newUser = await User.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      email: email,
      password: passwords.new
    }
  })

  res.status(200).json(newUser)
}

const deleteUser = async ({ params: { id } }, res) => {
  const user = await User.findById(id)
  user.state = 'disabled'
  await user.save()
  res.status(200).clearCookie('token').json({
    messages: ['Utente disabilitato con successo.']
  })
}

const searchUser = async ({ params: { query }, user }, res) => {
  const regex = query.split(' ').join('|')

  const users = await User.find({
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
        $ne: user._id
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

const getDocumentsOnVisibility = async ({ params: { id, visibility }, user }, res) => {
  const query = {
    author: id,
    visibility
  }

  if (user.privileges._id !== 'admin' && user._id !== id && visibility === 'materia') {
    query.subject = {
      $in: user.accesses
    }
  }

  let documents = await Document.find(query)
    .sort({
      _id: 1
    })
    .lean()

  documents.map(document => Document.isEditable(document, user))

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

const countDocumentsOnVisibility = async ({ params: { id, visibility } }, res) => {
  const documents = await Document.countDocuments({
    author: id,
    visibility
  })
  res.status(200).send(documents.toString())
}

const patchPicOfUser = async ({ params: { id }, file }, res) => {
  if (!file) {
    return res.status(400).json({
      messages: ['Nessun file caricato.']
    })
  }

  const master = fs.createReadStream(file.path)
  const mimetypes = ['image/jpeg', 'image/png', 'image/gif']
  const store = uploader(file.mimetype, mimetypes)

  try {
    await store.pics(master, id)
    res.status(200).send({
      messages: ['Immagine di profilo aggiornata con successo.']
    })
  } catch (e) {
    throw new Error('Si è verificato un errore durante l\'aggiornamento dell\'immaggine.')
  }
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
