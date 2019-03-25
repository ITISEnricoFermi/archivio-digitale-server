const mongoose = require('mongoose')

var CollectionPermissionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  permission: {
    type: String,
    required: true,
    unique: false,
    minlength: 1
  }
})

CollectionPermissionSchema.statics.getPermissions = function () {
  const CollectionPermission = this

  return CollectionPermission.find()
    .then((results) => {
      return Promise.resolve(results)
    }, (e) => {
      return Promise.reject(e)
    })
}

const CollectionPermission = mongoose.model('collection_permission', CollectionPermissionSchema)

module.exports = {
  CollectionPermission
}
