const {
  CollectionPermission
} = require('../models/collection_permission')

const getCollectionPermission = async ({ params: { id } }, res) => {
  const permission = await CollectionPermission.findById(id)

  if (!permission) {
    return res.status(404).json({
      messages: ['Il permesso non esiste.']
    })
  }

  res.status(200).json(permission)
}

const getCollectionPermissions = async (req, res) => {
  const permissions = await CollectionPermission.getPermissions()
  res.status(200).send(permissions)
}

module.exports = {
  getCollectionPermission,
  getCollectionPermissions
}
