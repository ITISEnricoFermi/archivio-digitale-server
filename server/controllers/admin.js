const _ = require('lodash')
const bcrypt = require('bcryptjs')
const path = require('path')
const sharp = require('sharp')
const mkdirp = require('mkdirp')
const axios = require('axios')

const {
  User
} = require('../models/user')

const postUser = async (req, res) => {
  let body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'privileges', 'accesses'])

  body.state = 'active'

  const user = await (new User(body)).save()

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

  const dir = {
    folder: path.join(__dirname, '..', 'public', 'pics', String(user._id)),
    default: path.join(__dirname, '..', 'public', 'images', 'profile.svg')
  }

  mkdirp(dir.folder)

  for (let i = 0; i < sizes.length; i++) {
    await sharp(dir.default)
      .resize(sizes[i].xy, sizes[i].xy)
      .toFormat('jpeg')
      .toFile(path.join(dir.folder, sizes[i].path + '.jpeg'))
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

module.exports = {
  postUser,
  patchUser,
  sendEmail,
  getRequests,
  acceptRequest,
  refuseRequest,
  toggleState,
  resetPassword
}
