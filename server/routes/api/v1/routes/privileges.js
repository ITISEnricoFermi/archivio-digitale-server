const express = require('express')
const router = express.Router()

const {
  getPrivileges
} = require('../../../../controllers/privileges')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/', asyncMiddleware(getPrivileges))

module.exports = router
