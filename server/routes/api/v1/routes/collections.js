const express = require('express')
const router = express.Router()

const {
  getCollection,
  postCollection,
  patchCollection,
  deleteCollection,
  searchCollections
} = require('../../../../controllers/collections')

// Middleware
const {
  authenticate
} = require('../../../../middlewares/authenticate')

const {
  asyncMiddleware
} = require('../../../../middlewares/async')

const {
  checkCollectionById,
  checkCollectionEditableById,
  checkErrors
} = require('../../../../middlewares/check')

router.get('/:id',
  authenticate,
  checkCollectionById,
  checkErrors,
  asyncMiddleware(getCollection))

router.post('/',
  authenticate,
  asyncMiddleware(postCollection))

router.patch('/:id',
  authenticate,
  checkCollectionById,
  checkCollectionEditableById,
  checkErrors,
  asyncMiddleware(patchCollection))

router.delete('/:id',
  authenticate,
  checkCollectionById,
  checkCollectionEditableById,
  checkErrors,
  asyncMiddleware(deleteCollection))
router.post('/search/', authenticate, asyncMiddleware(searchCollections))

module.exports = router
