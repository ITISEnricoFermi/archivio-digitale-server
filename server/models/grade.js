const mongoose = require('mongoose')

var GradeSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    trim: true,
    minlength: 1
  },
  grade: {
    type: Number,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
  }
})

GradeSchema.statics.getGrades = function () {
  var Grade = this

  return Grade.find()
    .sort({
      grade: 1
    })
    .then((classes) => {
      return Promise.resolve(classes)
    }, (e) => {
      return Promise.reject(e)
    })
}

var Grade = mongoose.model('Grade', GradeSchema)

module.exports = {
  Grade
}
