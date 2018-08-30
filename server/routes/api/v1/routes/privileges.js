const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  Privilege
} = require('../../../../models/privilege')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let privileges = await Privilege.getPrivileges()
  res.status(200).send(privileges)
}))

module.exports = router
