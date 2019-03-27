const {
  User
} = require('../../../models/user')

const {
  Document
} = require('../../../models/document')

module.exports = {
  Query: {
    async user (root, { id }, context) {
      const user = await User.findById(id)
      return user
    },
    async document (root, { id }, context) {
      const document = await Document.findById(id)
      return document
    }
  }
}
