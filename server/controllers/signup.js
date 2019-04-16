const fs = require('fs')
const _ = require('lodash')
const path = require('path')

const uploader = require('../lib/uploader')

// Models
const {
  User
} = require('../models/user')

const signup = async (req, res) => {
  const body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'accesses'])

  const user = new User(body)
  const master = fs.createReadStream(path.join(__dirname, '..', 'public', 'images', 'profile.svg'))
  const mimetypes = ['image/jpeg', 'image/png', 'image/gif']
  const store = uploader(req, mimetypes)

  try {
    await store.pics(master, user.id)
    await user.save()
    res.status(200).json(user)
  } catch (e) {
    console.log(e)
    throw new Error('Si è verificato un errore durante la creazione dell\'utente.')
  }
}

module.exports = {
  signup
}
