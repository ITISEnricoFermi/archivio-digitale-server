const {
  mongoose
} = require('../mongoose')

const {
  Section
} = require('../../models/section')

const sectionArray = require('../seeds/section.json')

let loadSections = () => {
  sectionArray.forEach((section) => {
    let sectionToInsert = new Section(section)
    sectionToInsert.save()
  })
}

module.exports = {
  loadSections
}
