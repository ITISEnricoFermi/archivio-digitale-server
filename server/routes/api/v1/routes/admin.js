const express = require('express')
const router = express.Router()

const {
  postUser,
  patchUser,
  sendEmail,
  getRequests,
  acceptRequest,
  refuseRequest,
  toggleState,
  resetPassword
} = require('../../../../controllers/admin')

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.post('/users/', authenticate, authenticateAdmin, asyncMiddleware(postUser))
router.patch('/users/:id', authenticate, authenticateAdmin, asyncMiddleware(patchUser))
router.patch('/users/:id/state/', authenticate, authenticateAdmin, asyncMiddleware(toggleState))
router.patch('/users/:id/password', authenticate, authenticateAdmin, asyncMiddleware(resetPassword))
router.post('/mails/', authenticate, authenticateAdmin, asyncMiddleware(sendEmail))
router.get('/requests/', authenticate, authenticateAdmin, asyncMiddleware(getRequests))
router.patch('/requests/:id', authenticate, authenticateAdmin, asyncMiddleware(acceptRequest))
router.delete('/requests/:id', authenticate, authenticateAdmin, asyncMiddleware(refuseRequest))

module.exports = router
