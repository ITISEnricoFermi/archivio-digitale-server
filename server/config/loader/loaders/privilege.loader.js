require('../../lib/mongoose')

const {
  Privilege
} = require('../../../models/privilege')

const privileges = require('../../seed/seeds/privilege.json')

const loadPrivileges = new Promise((resolve, reject) => {
  return Privilege.insertMany(privileges, {
    ordered: false
  })
    .then(response => resolve('Privilegi (utenti) creati con successo.'))
    .catch(e => reject(new Error('Impossibile creare i privilegi (utenti).')))
})

module.exports = {
  loadPrivileges
}
