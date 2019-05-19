const express = require('express')
const router = express.Router()

const {
  getCollectionPermission,
  getCollectionPermissions
} = require('../../../../controllers/collection_permissions')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getCollectionPermission))

router.get('/', asyncMiddleware(getCollectionPermissions))

module.exports = router
