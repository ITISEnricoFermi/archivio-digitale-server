const mongoose = require('mongoose')

const FacultySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  faculty: {
    type: String,
    required: true,
    unique: true,
    minlength: 1
  },
  subjects: [{
    type: String,
    unique: false,
    required: true,
    minlength: 1,
    trim: true,
    ref: 'Subject'
  }]
})

FacultySchema.statics.getFaculties = function () {
  const Faculty = this

  return Faculty.find({})
    .populate('subjects')
    .then(faculties => {
      return Promise.resolve(faculties)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const Faculty = mongoose.model('Faculty', FacultySchema)

module.exports = {
  Faculty
}
