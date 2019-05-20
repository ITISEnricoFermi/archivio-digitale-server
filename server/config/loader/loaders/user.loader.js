require('../../../lib/mongoose')

const path = require('path')
const fs = require('fs')

const {
  User
} = require('../../../models/user')

const users = require('../../seed/seeds/user.json')
const uploader = require('../../../lib/uploader')

const master = fs.createReadStream(path.join(__dirname, '..', '..', '..', 'assets', 'profile.svg'))
const mimetypes = ['image/svg+xml']
const store = uploader('image/jpeg', mimetypes)

const loadUsers = new Promise((resolve, reject) => {
  return User.create(users)
    .then(users => {
      const pics = []
      for (let i = 0; i < users.length; i++) {
        pics.push(store.pics(master, users[i].id))
      }
      return Promise.all(pics)
        .then(() => {
          resolve('Utenti creati con successo.')
        })
        .catch(e => {
          reject(new Error('Impossibile generare le foto degli utenti.'))
        })
    })
    .catch(e => reject(new Error(e)))
})

module.exports = {
  loadUsers
}
