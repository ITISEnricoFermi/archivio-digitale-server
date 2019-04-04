const mongoose = require('mongoose')

const CollectionPermissionSchema = new mongoose.Schema({
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
  const CollectionPermission = this

  return CollectionPermission.find()
    .then(permissions => {
      return Promise.resolve(permissions)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

const CollectionPermission = mongoose.model('collection_permission', CollectionPermissionSchema)

module.exports = {
  CollectionPermission
}
