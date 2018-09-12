const {
  mongoose
} = require('../mongoose')

const {
  Grade
} = require('../../models/grade')

const classArray = require('../seeds/grade.json')

let loadClasses = async () => {
  try {
    let docs = await Grade.insertMany(classArray, {
      ordered: false
    })

    if (!docs.length) return false
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  loadClasses
}
