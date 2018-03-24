const {
  mongoose
} = require('../mongoose')

const {
  CollectionPermission
} = require('../../models/collection_permission')

const collectionPermissionArray = require('../seeds/collectionPermission.json')

let loadCollectionPermissions = async () => {
  try {
    let docs = await CollectionPermission.insertMany(collectionPermissionArray, {
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
  loadCollectionPermissions
}
