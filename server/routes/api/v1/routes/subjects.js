const express = require('express')
const router = express.Router()

const {
  getSubjects,
  searchSubjects
} = require('../../../../controllers/subjects')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

router.get('/', asyncMiddleware(getSubjects))
router.get('/search/partial/:query', asyncMiddleware(searchSubjects))

module.exports = router
