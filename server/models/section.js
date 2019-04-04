const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un ID valido.'
    // }
  },
  section: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è una sezione valida.'
    // }
  }
})

SectionSchema.statics.getSections = function () {
  const Section = this

  return Section.find()
    .sort({
      section: 1
    })
    .then(sections => {
      return Promise.resolve(sections)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const Section = mongoose.model('Section', SectionSchema)

module.exports = {
  Section
}
