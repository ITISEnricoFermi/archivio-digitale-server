const mongoose = require('mongoose')

const PrivilegeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  privilege: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
  }
})

PrivilegeSchema.statics.getPrivileges = function () {
  const Privilege = this

  return Privilege.find()
    .then((privilege) => {
      return Promise.resolve(privilege)
    }, (e) => {
      return Promise.reject(e)
    })
}

const Privilege = mongoose.model('Privilege', PrivilegeSchema)

module.exports = {
  Privilege
}
