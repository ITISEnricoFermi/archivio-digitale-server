const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  CollectionPermission
} = require('../../../../models/collection_permission')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let permissions = await CollectionPermission.getPermissions()
  res.status(200).send(permissions)
}))

module.exports = router
