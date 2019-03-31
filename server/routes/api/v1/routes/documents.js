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
const logged = require('../../../../middlewares/logged')
const upload = require('../../../../middlewares/file_upload')

const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  checkDocumentById,
  checkDocumentEditableById,
  checkDocumentReadableById,
  checkErrors
} = require('../../../../middlewares/check')

router.get('/:id',
  authenticate,
  checkDocumentById,
  checkDocumentReadableById,
  checkErrors,
  asyncMiddleware(getDocument))

router.post('/',
  authenticate,
  logged,
  upload,
  asyncMiddleware(postDocument))

router.patch('/:id',
  authenticate,
  logged,
  checkDocumentById,
  checkDocumentEditableById,
  checkErrors,
  asyncMiddleware(patchDocument))

router.get('/:id/collections',
  authenticate,
  logged,
  checkDocumentById,
  checkErrors,
  asyncMiddleware(getCollectionsOnDocument))

router.delete('/:id',
  authenticate,
  logged,
  checkDocumentById,
  checkDocumentEditableById,
  checkErrors,
  asyncMiddleware(deleteDocument))

router.post('/search/',
  authenticate,
  asyncMiddleware(searchDocument))

router.get('/recent/:page/:number/:type?',
  authenticate,
  asyncMiddleware(getRecentDocuments))

router.post('/search/partial/:query',
  authenticate,
  logged,
  asyncMiddleware(partialSearchDocuments))

module.exports = router
