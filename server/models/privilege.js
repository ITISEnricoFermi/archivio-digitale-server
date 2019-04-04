const mongoose = require('mongoose')

const PrivilegeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un ID valido.'
    // }
  },
  privilege: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: true
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un privilegio valido.'
    // }
  }
})

PrivilegeSchema.statics.getPrivileges = function () {
  const Privilege = this

  return Privilege.find()
    .then(privileges => {
      return Promise.resolve(privileges)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const Privilege = mongoose.model('Privilege', PrivilegeSchema)

module.exports = {
  Privilege
}
