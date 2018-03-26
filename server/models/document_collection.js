const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

var DocumentCollectionSchema = new mongoose.Schema({
  documentCollection: { // Nome della collezione
    type: String,
    required: true,
    minlength: 1,
    unique: false
  },
  author: { // Autore della collezione
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: 'User'
  },
  documents: [{
    type: mongoose.Schema.ObjectId,
    required: false,
    minlength: 1,
    unique: false,
    trim: true,
    ref: 'Document'
  }],
  permissions: { // Possibilià di modifica e di aggiunta di documenti
    type: String,
    default: 'tutti',
    required: false,
    unique: false,
    trim: true,
    ref: 'collection_permission'
  },
  authorizations: [{ // Proprietari della collezione
    type: mongoose.Schema.ObjectId,
    required: false,
    minlength: 1,
    unique: false,
    trim: true,
    ref: 'User'
  }]
})

DocumentCollectionSchema.statics.searchCollections = function (search) {
  let DocumentCollection = this

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
    .then((results) => {
      return Promise.resolve(results)
    }, (e) => {
      return Promise.reject(e)
    })
}

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

var DocumentCollection = mongoose.model('document_collection', DocumentCollectionSchema)

module.exports = {
  DocumentCollection
}
