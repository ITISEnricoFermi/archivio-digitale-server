const express = require('express')
const router = express.Router()

const {
  getPrivilege,
  getPrivileges
} = require('../../../../controllers/privileges')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getPrivilege))

router.get('/', asyncMiddleware(getPrivileges))

module.exports = router
