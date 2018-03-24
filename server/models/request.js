const mongoose = require('mongoose')
const _ = require('lodash')

// Models
const {
  User
} = require('./user')

const {
  ObjectId
} = require('mongodb')

var RequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    minlength: 1,
    trim: true,
    ref: 'User'
  }
})

RequestSchema.statics.addRequest = function (id) {
  var Request = this

  if (!ObjectId.isValid(id)) {
    return Promise.reject("L'ID fornito non è valido.")
  }

  return User.findById(id).then((user) => {
    if (!user) {
      return Promise.reject("Nessun utente registrato con l'ID fornito.")
    }

    var request = new Request({
      userId: id
    })

    return request.save().then((request) => {
      return Promise.resolve(request)
    }, (e) => {
      return Promise.reject(e)
    })
  }, (e) => {
    return Promise.reject(e)
  })
}

RequestSchema.statics.getRequests = function () {
  var Request = this

  return Request.find()
    .populate('userId')
    .then((requests) => {
      return Promise.resolve(requests)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

RequestSchema.statics.acceptRequestById = function (id) {
  var Request = this

  return Request.findById(id)
    .then((request) => {
      return User.findById(request.userId)
    })
    .then((user) => {
      return user.update({
        state: 'active'
      })
    })
    .then((user) => {
      return Request.findByIdAndRemove(request.id)
    })
    .then((request) => {
      return Promise.resolve(request)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

var Request = mongoose.model('Request', RequestSchema)

module.exports = {
  Request
}
