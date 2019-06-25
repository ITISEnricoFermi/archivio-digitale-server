const fs = require('fs')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const path = require('path')
const axios = require('axios')

const uploader = require('../lib/uploader')

const {
  User
} = require('../models/user')

const postUser = async ({ body }, res) => {
  body = _.pick(body, ['firstname', 'lastname', 'email', 'password', 'privileges', 'accesses'])

  body.state = 'active'
  const user = new User(body)

  const master = fs.createReadStream(path.join(__dirname, '..', 'assets', 'profile.svg'))
  const mimetypes = ['image/svg+xml', 'image/jpeg'] // Momentaneamente per evitare errori
  // const mimetypes = ['image/svg+xml']
  const store = uploader('image/jpeg', mimetypes)

  await store.pics(master, user.id)
  await user.save()

  res.status(200).json(user)
}

const patchUser = async ({ body, params: { id } }, res) => {
  body = _.pick(body, ['firstname', 'lastname', 'state', 'email', 'privileges', 'accesses'])

  const user = await User.findByIdAndUpdate(id, {
    $set: body
  })

  res.status(200).json(user)
}

const sendEmail = async ({ subject, recipients, message }, res) => {
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
  const users = await User.find({
    state: 'pending'
  })
  res.status(200).json(users)
}

const acceptRequest = async ({ params: { id } }, res) => {
  await User.findByIdAndUpdate(id, {
    $set: {
      state: 'active'
    }
  })
  res.status(200).send({
    messages: ['Richiesta d\'iscrizione accettata.']
  })
}

const refuseRequest = async ({ params: { id } }, res) => {
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

const toggleState = async ({ params: { id } }, res) => {
  const user = await User.findById(id)

  const updated = await user.update({
    $set: {
      state: user.state === 'active' ? 'disabled' : 'active'
    }
  })

  res.status(200).json(updated)
}

const resetPassword = async ({ params: { id } }, res) => {
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

const update = async ({ body: { service, tag } }, res) => {
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
