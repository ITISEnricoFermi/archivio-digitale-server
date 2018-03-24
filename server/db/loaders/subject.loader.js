const {
  mongoose
} = require('../mongoose')

const {
  Subject
} = require('../../models/subject')

const subjectArray = require('../seeds/subject.json')

let loadSubjects = async () => {
  try {
    let docs = await Subject.insertMany(subjectArray, {
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
  loadSubjects
}
