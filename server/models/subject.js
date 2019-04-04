const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
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
  const Subject = this

  return Subject.find({})
    .then(subjects => {
      return Promise.resolve(subjects)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const Subject = mongoose.model('Subject', SubjectSchema)

module.exports = {
  Subject
}
