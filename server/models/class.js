const mongoose = require('mongoose')

var ClassSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    trim: true,
    minlength: 1
  },
  class: {
    type: Number,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
  }
})

ClassSchema.statics.getClasses = function () {
  var Class = this

  return Class.find()
    .sort({
      class: 1
    })
    .then((classes) => {
      return Promise.resolve(classes)
    }, (e) => {
      return Promise.reject(e)
    })
}

var Class = mongoose.model('Class', ClassSchema)

module.exports = {
  Class
}
