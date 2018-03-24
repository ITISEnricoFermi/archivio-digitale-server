const {
  mongoose
} = require('../mongoose')

const {
  Faculty
} = require('../../models/faculty')

const facultyArray = require('../seeds/faculty.json')

let loadFaculties = () => {
  facultyArray.forEach((faculty) => {
    let facultyToInsert = new Faculty(faculty)
    facultyToInsert.save()
  })
}

module.exports = {
  loadFaculties
}
