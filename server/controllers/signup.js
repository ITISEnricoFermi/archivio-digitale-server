const _ = require('lodash')
const path = require('path')
const sharp = require('sharp')
const mkdirp = require('mkdirp')

// Models
const {
  User
} = require('../models/user')

const signup = async (req, res) => {
  const body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'accesses'])
  let user = await (new User(body)).save()

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

  let dir = path.join(__dirname, '..', 'public', 'pics', String(user._id))

  mkdirp(dir)

  for (let i = 0; i < sizes.length; i++) {
    try {
      await sharp(path.join(__dirname, '..', 'public', 'images', 'profile.svg')).resize(sizes[i].xy, sizes[i].xy).toFormat('jpeg').toFile(path.join(__dirname, '..', 'public', 'pics', String(user._id), sizes[i].path + '.jpeg'))
    } catch (e) {
      throw new Error('Si è verificato un errore durante la creazione dell\'utente.')
    }
  }

  res.status(200).json(user)
}

module.exports = {
  signup
}
