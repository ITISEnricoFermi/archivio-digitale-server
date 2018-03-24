const {
  mongoose
} = require('../mongoose')

const {
  Subject
} = require('../../models/subject')

const subjectArray = require('../seeds/subject.json')

let loadSubjects = () => {
  subjectArray.forEach((subject) => {
    let subjectToInsert = new Subject(subject)

    subjectToInsert.save()
  })
}

module.exports = {
  loadSubjects
}
