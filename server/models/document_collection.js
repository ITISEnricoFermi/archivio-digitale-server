const mongoose = require('mongoose')
const _ = require('lodash')

const {
  ObjectId
} = mongoose.Schema

// Models
const {
  CollectionPermission
} = require('../models/collection_permission')

const {
  Document
} = require('../models/document')

const {
  User
} = require('../models/user')

const DocumentCollectionSchema = new mongoose.Schema({
  documentCollection: {
    type: String,
    required: true,
    minlength: 1
  },
  author: {
    type: ObjectId,
    required: true,
    minlength: 1,
    trim: true,
    ref: 'User'
  },
  documents: {
    type: [{
      type: ObjectId,
      minlength: 1,
      required: true,
      trim: true,
      ref: 'Document',
      validate: [async (value) => {
        let document = await Document.findById(value)
        if (!document) return false
      }, '\'{VALUE}\' non è un documento valido']
    }]
  },
  permissions: {
    type: String,
    default: 'tutti',
    trim: true,
    ref: 'collection_permission',
    validate: [async (value) => {
      let permissions = await CollectionPermission.findById(value)
      if (!permissions) return false
    }, 'Uno dei permessi di modifica non è valido.']
  },
  authorizations: [{
    type: ObjectId,
    minlength: 1,
    required: true,
    trim: true,
    ref: 'User',
    validate: [async (value) => {
      let authorization = await User.findById(value)
      if (!authorization) return false
    }, '\'{VALUE}\' non è un utente valido.']
  }]
})

DocumentCollectionSchema.statics.isEditable = function (collection, user) {
  const isAdmin = user.privileges._id === 'admin'
  const isAuthor = user._id === collection.author._id
  const authorizations = collection.authorizations.map(el => String(el._id))
  const isAuthorized = authorizations.includes(String(user._id))
  collection.editable = !!(isAdmin || isAuthor || isAuthorized)
  return collection
}

DocumentCollectionSchema.statics.searchCollections = function (search, user) {
  const DocumentCollection = this

  let andQuery = []

  if (search.fulltext) {
    andQuery.push({
      $text: {
        $search: search.fulltext
      }
    })
  }

  if (search.permissions) {
    andQuery.push({
      type: search.permissions
    })
  }

  return DocumentCollection.find({
    $and: andQuery
  }, {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  })
    .limit(10)
    .lean()
    .catch(e => {
      return Promise.reject(e)
    })
}

DocumentCollectionSchema.pre('save', function (next) {
  const collection = this
  collection.documentCollection = _.upperFirst(collection.documentCollection)
  next()
})

DocumentCollectionSchema.pre('find', function (next) {
  this.populate('author')
    .populate('documents')
    .populate('permissions')
    .populate('authorizations')

  next()
})

DocumentCollectionSchema.pre('findOne', function (next) {
  this.populate('author')
    .populate('documents')
    .populate('permissions')
    .populate('authorizations')

  next()
})

DocumentCollectionSchema.index({
  documentCollection: 'text'
})

const DocumentCollection = mongoose.model('document_collection', DocumentCollectionSchema)

module.exports = {
  DocumentCollection
}
