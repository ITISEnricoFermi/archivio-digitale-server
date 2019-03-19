require('../../lib/mongoose')

const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const {
  User
} = require('../../../models/user')

const users = require('../../seed/seeds/user.json')

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

const loadUsers = new Promise((resolve, reject) => {
  return User.create(users)
    .then(response => {
      let files = []

      for (let c = 0; c < response.length; c++) {
        let dir = path.join(__dirname, '..', '..', '..', 'public', 'pics', String(response[c]._id))

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }

        for (let i = 0; i < sizes.length; i++) {
          const file = sharp(path.join(__dirname, '..', '..', '..', 'public', 'images', 'profile.svg'))
            .resize(sizes[i].xy, sizes[i].xy)
            .toFormat('jpeg')
            .toFile(path.join(__dirname, '..', '..', '..', 'public', 'pics', String(response[c]._id), sizes[i].path + '.jpeg'))
          files.push(file)
        }
      }

      return Promise.all(files)
        .then(files => resolve('Utenti creati con successo.'))
        .catch(e => reject(new Error('Impossibile generare le foto degli utenti.')))
    })
    .catch(e => reject(new Error(e)))
})

module.exports = {
  loadUsers
}
