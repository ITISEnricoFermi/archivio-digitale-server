const mongoose = require('mongoose')
const validator = require('validator')

var CollectionPermissionSchema = new mongoose.Schema({
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
  permission: {
    type: String,
    required: true,
    unique: false,
    minlength: 1
    // validate: {
    //   validator: validator.isAlpha,
    //   message: "{VALUE} non è un permesso valido."
    // }
  }
})

CollectionPermissionSchema.statics.getPermissions = function () {
  var CollectionPermission = this

  return CollectionPermission.find()
    .then((results) => {
      return Promise.resolve(results)
    }, (e) => {
      return Promise.reject(e)
    })
}

var CollectionPermission = mongoose.model('collection_permission', CollectionPermissionSchema)

module.exports = {
  CollectionPermission
}
