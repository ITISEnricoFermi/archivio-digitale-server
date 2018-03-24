const {
  mongoose
} = require('../mongoose')

const {
  Section
} = require('../../models/section')

const sectionArray = require('../seeds/section.json')

let loadSections = async () => {
  try {
    let docs = await Section.insertMany(sectionArray, {
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
  loadSections
}
