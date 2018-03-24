const {
  mongoose
} = require('../mongoose')

const {
  Class
} = require('../../models/class')

const classArray = require('../seeds/class.json')

let loadClasses = () => {
  classArray.forEach((classObj) => {
    let classToInsert = new Class(classObj)
    classToInsert.save()
  })
}

module.exports = {
  loadClasses
}
