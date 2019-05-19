const express = require('express')
const router = express.Router()

const {
  getSubject,
  getSubjects,
  searchSubjects
} = require('../../../../controllers/subjects')

// Middleware
const {
  asyncMiddleware
} = require('../../../../middlewares/async')

router.get('/:id', asyncMiddleware(getSubject))

router.get('/', asyncMiddleware(getSubjects))

router.get('/search/partial/:query', asyncMiddleware(searchSubjects))

module.exports = router
