require('../../mongoose')

const {
  CollectionPermission
} = require('../../../models/collection_permission')

const collectionPermissions = require('../../seed/seeds/collectionPermission.json')

const loadCollectionPermissions = new Promise((resolve, reject) => {
  return CollectionPermission.insertMany(collectionPermissions, {
    ordered: false
  })
    .then(response => resolve('Permessi (collezioni) creati con successo.'))
    .catch(e => reject(new Error('Impossibile creare i permessi')))
})

module.exports = {
  loadCollectionPermissions
}
