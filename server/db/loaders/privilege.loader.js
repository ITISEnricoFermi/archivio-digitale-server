const {
  mongoose
} = require('../mongoose')

const {
  Privilege
} = require('../../models/privilege')

const privilegeArray = require('../seeds/privilege.json')

let loadPrivileges = async () => {
  try {
    let docs = await Privilege.insertMany(privilegeArray, {
      ordered: false
    })

    if (docs) {
      return true
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  loadPrivileges
}
