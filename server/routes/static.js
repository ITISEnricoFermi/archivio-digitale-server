const express = require('express')
const router = express.Router()
const path = require('path')

const {
  getDocument
} = require('../controllers/static')

const {
  asyncMiddleware
} = require('../middlewares/async')

const {
  authenticate
} = require('../middlewares/authenticate')

router.use('/documents/',
  authenticate,
  asyncMiddleware(getDocument),
  express.static(path.join(__dirname, '..', 'public', 'public', 'documents')))

module.exports = router
