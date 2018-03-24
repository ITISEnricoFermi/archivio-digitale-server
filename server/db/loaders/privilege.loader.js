const {
  mongoose
} = require('../mongoose')

const {
  Privilege
} = require('../../models/privilege')

const privilegeArray = require('../seeds/privilege.json')

let loadPrivileges = () => {
  privilegeArray.forEach(async (privilege) => {
    let privilegeToInsert = new Privilege(privilege)
    privilegeToInsert.save()
  })
}

module.exports = {
  loadPrivileges
}
