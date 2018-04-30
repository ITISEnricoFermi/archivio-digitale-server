const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const {
  mongoose
} = require('../mongoose')

const {
  User
} = require('../../models/user')

const userArray = require('../seeds/user.json')

let loadUsers = async () => {
  try {
    let users = await User.create(userArray)

    if (users) {
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

      for (let c = 0; c < users.length; c++) {
        let dir = path.join(__dirname, '..', '..', 'public', 'pics', String(users[c]._id))

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }

        for (let i = 0; i < sizes.length; i++) {
          await sharp(path.join(__dirname, '..', '..', 'public', 'images', 'profile.svg')).resize(sizes[i].xy, sizes[i].xy).toFormat('jpeg').toFile(path.join(__dirname, '..', '..', 'public', 'pics', String(users[i]._id), sizes[i].path + '.jpeg'))
        }
      }

      return true
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  loadUsers
}
