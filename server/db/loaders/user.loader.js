const {
  mongoose
} = require('../mongoose')

const {
  User
} = require('../../models/user')

const userArray = require('../seeds/user.json')

let loadUsers = async () => {
  try {
    let docs = await User.create(userArray)

    if (docs) {
      return true
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  loadUsers
}
