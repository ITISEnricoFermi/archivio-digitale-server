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
const logged = require('../../../../middlewares/logged')

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
  logged,
  checkCollectionById,
  checkErrors,
  asyncMiddleware(getCollection))

router.post('/',
  authenticate,
  logged,
  asyncMiddleware(postCollection))

router.patch('/:id',
  authenticate,
  logged,
  checkCollectionById,
  checkCollectionEditableById,
  checkErrors,
  asyncMiddleware(patchCollection))

router.delete('/:id',
  authenticate,
  logged,
  checkCollectionById,
  checkCollectionEditableById,
  checkErrors,
  asyncMiddleware(deleteCollection))

router.post('/search/',
  authenticate,
  logged,
  asyncMiddleware(searchCollections))

module.exports = router
