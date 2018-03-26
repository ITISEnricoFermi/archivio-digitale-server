const mongoose = require('mongoose')
const validator = require('validator')

var PrivilegeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un ID valido.'
    }
  },
  privilege: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un privilegio valido.'
    }
  }
})

PrivilegeSchema.statics.getPrivileges = function () {
  var Privilege = this

  return Privilege.find()
    .then((privilege) => {
      return Promise.resolve(privilege)
    }, (e) => {
      return Promise.reject(e)
    })
}

var Privilege = mongoose.model('Privilege', PrivilegeSchema)

module.exports = {
  Privilege
}
