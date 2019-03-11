const express = require('express')
const router = express.Router()

const {
  getCollectionPermissions
} = require('../../../../controllers/collection_permissions')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getCollectionPermissions))

module.exports = router
