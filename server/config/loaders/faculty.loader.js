const {
  mongoose
} = require('../mongoose')

const {
  Faculty
} = require('../../models/faculty')

const facultyArray = require('../seeds/faculty.json')

let loadFaculties = async () => {
  try {
    let docs = await Faculty.insertMany(facultyArray, {
      ordered: false
    })

    if (!docs.length) return false
    return true
  } catch (e) {
    return false
  }
}
module.exports = {
  loadFaculties
}
