const fs = require('fs')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const path = require('path')
const axios = require('axios')

const uploader = require('../lib/uploader')

const {
  User
} = require('../models/user')

const postUser = async (req, res) => {
  let body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'privileges', 'accesses'])

  body.state = 'active'
  const user = new User(body)
  const master = fs.createReadStream(path.join(__dirname, '..', 'assets', 'profile.svg'))
  const mimetypes = ['image/jpeg', 'image/png', 'image/gif']
  const store = uploader('image/jpeg', mimetypes)

  try {
    await store.pics(master, user.id)
    await user.save()
    res.status(200).send({
      messages: ['Immagine di profilo aggiornata con successo.']
    })
  } catch (e) {
    throw new Error('Si è verificato un errore durante la creazione dell\'utente.')
  }

  res.status(200).json(user)
}

const patchUser = async (req, res) => {
  const body = _.pick(req.body, ['firstname', 'lastname', 'state', 'email', 'privileges', 'accesses'])

  let user = await User.findByIdAndUpdate(req.params.id, {
    $set: body
  })

  res.status(200).json(user)
}

const sendEmail = async (req, res) => {
  const { subject, recipients, message } = req.body
  if (!process.env.MAILER_URL) {
    return res.status(422).json({
      messages: ['Mailer non disponibile.']
    })
  }

  const { data } = await axios.post(process.env.MAILER_URL, {
    subject, recipients, message
  })
  res.status(200).json(data)
}

const getRequests = async (req, res) => {
  const users = await User.find({state: 'pending'})
  res.status(200).json(users)
}

const acceptRequest = async (req, res) => {
  const id = req.params.id
  await User.findByIdAndUpdate(id, {
    $set: {
      state: 'active'
    }
  })
  res.status(200).send({
    messages: ['Richiesta d\'iscrizione accettata.']
  })
}

const refuseRequest = async (req, res) => {
  const id = req.params.id
  const user = await User.findByIdAndRemove(id)

  if (!user) {
    return res.status(400).send({
      messages: ['L\'utente non esiste']
    })
  }

  return res.status(200).send({
    messages: ['Richiesta d\'iscrizione rifiutata.']
  })
}

const toggleState = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)

  const updated = await user.update({
    $set: {
      state: user.state === 'active' ? 'disabled' : 'active'
    }
  })

  res.status(200).json(updated)
}

const resetPassword = async (req, res) => {
  const id = req.params.id

  const password = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  await User.findByIdAndUpdate(id, {
    password: hash
  })
  return res.status(200).json({
    password: password
  })
}

const update = async (req, res) => {
  const { service, tag } = req.body

  if (!process.env.UPDATER_URL) {
    return res.status(422).json({
      messages: ['Updater non disponibile.']
    })
  }

  const { data } = await axios.post(process.env.UPDATER_URL, {
    service,
    tag
  })

  res.status(200).json(data)
}

module.exports = {
  postUser,
  patchUser,
  sendEmail,
  getRequests,
  acceptRequest,
  refuseRequest,
  toggleState,
  resetPassword,
  update
}
