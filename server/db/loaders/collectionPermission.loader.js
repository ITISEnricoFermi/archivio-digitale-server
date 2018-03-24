const {
  mongoose
} = require('../mongoose')

const {
  CollectionPermission
} = require('../../models/collection_permission')

const collectionPermissionArray = require('../seeds/collectionPermission.json')

let loadCollectionPermissions = () => {
  collectionPermissionArray.forEach((permission) => {
    let collectionPermissionToInsert = new CollectionPermission(permission)
    collectionPermissionToInsert.save()
  })
}

module.exports = {
  loadCollectionPermissions
}
