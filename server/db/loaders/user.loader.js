const {
  mongoose
} = require('../mongoose')

const {
  User
} = require('../../models/user')

const userArray = require('../seeds/user.json')

let loadUsers = () => {
  userArray.forEach((user) => {
    let userToInsert = new User(user)
    userToInsert.save()
  })
}

module.exports = {
  loadUsers
}
