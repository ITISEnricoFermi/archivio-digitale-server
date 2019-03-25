const mongoose = require('mongoose')

var SectionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  section: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
  }
})

SectionSchema.statics.getSections = function () {
  const Section = this

  return Section.find()
    .sort({
      section: 1
    })
    .then((sections) => {
      return Promise.resolve(sections)
    }, (e) => {
      return Promise.reject(e)
    })
}

const Section = mongoose.model('Section', SectionSchema)

module.exports = {
  Section
}
