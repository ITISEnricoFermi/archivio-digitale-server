const mongoose = require('mongoose')
const validator = require('validator')

var SubjectSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  subject: {
    type: String,
    unique: false,
    required: true,
    trim: false,
    minlength: 1
  }
})

SubjectSchema.statics.getSubjects = function () {
  var Subject = this

  return Subject.find({})
    .then((results) => {
      return Promise.resolve(results)
    }, (e) => {
      return Promise.reject(e)
    })
}

var Subject = mongoose.model('Subject', SubjectSchema)

module.exports = {
  Subject
}
