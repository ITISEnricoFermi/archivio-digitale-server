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
  const master = fs.createReadStream(path.join(__dirname, '..', 'assets', 'profile.svg'))
  const mimetypes = ['image/svg+xml', 'image/jpeg'] // Momentaneamente per evitare errori
  // const mimetypes = ['image/svg+xml']
  const store = uploader('image/jpeg', mimetypes)

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
