const express = require('express')
const router = express.Router()

const {
  getDocument,
  patchDocument,
  postDocument,
  deleteDocument,
  searchDocument,
  getRecentDocuments,
  partialSearchDocuments,
  getCollectionsOnDocument
} = require('../../../../controllers/documents')

// Middleware
const {
  authenticate
} = require('../../../../middlewares/authenticate')
const upload = require('../../../../middlewares/file_upload')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  editDocument
} = require('../../../../middlewares/edit')

router.get('/:id', authenticate, asyncMiddleware(getDocument))
router.post('/', authenticate, upload, asyncMiddleware(postDocument))
router.patch('/:id', authenticate, editDocument, asyncMiddleware(patchDocument))
router.get('/:id/collections', authenticate, asyncMiddleware(getCollectionsOnDocument))
router.delete('/:id', authenticate, editDocument, asyncMiddleware(deleteDocument))
router.post('/search/', authenticate, asyncMiddleware(searchDocument))
router.get('/recent/:page/:number', authenticate, asyncMiddleware(getRecentDocuments))
router.post('/search/partial/:query', authenticate, asyncMiddleware(partialSearchDocuments))

module.exports = router
