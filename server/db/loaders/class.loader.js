const {
  mongoose
} = require('../mongoose')

const {
  Class
} = require('../../models/class')

const classArray = require('../seeds/class.json')

let loadClasses = async () => {
  try {
    let docs = await Class.insertMany(classArray, {
      ordered: false
    })

    if (docs) {
      return true
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  loadClasses
}
