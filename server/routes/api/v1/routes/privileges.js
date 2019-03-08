const express = require('express')
const router = express.Router()

const {
  getPrivileges
} = require('../../../../controllers/privileges')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getPrivileges))

module.exports = router
