const {
  CollectionPermission
} = require('../models/collection_permission')

const getCollectionPermissions = async (req, res) => {
  let permissions = await CollectionPermission.getPermissions()
  res.status(200).send(permissions)
}

module.exports = {
  getCollectionPermissions
}