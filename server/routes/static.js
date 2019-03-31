const express = require('express')
const router = express.Router()

const {
  getDocument
} = require('../controllers/static')

const {
  asyncMiddleware
} = require('../middlewares/async')

const {
  authenticate
} = require('../middlewares/authenticate')

const {
  checkDocumentById,
  checkDocumentReadableById
} = require('../middlewares/check')

router.get('/documents/:id',
  authenticate,
  checkDocumentById,
  checkDocumentReadableById,
  asyncMiddleware(getDocument))

module.exports = router
