require('../../../lib/mongoose')

const {
  Subject
} = require('../../../models/subject')

const subjects = require('../../seed/seeds/subject.json')

const loadSubjects = new Promise((resolve, reject) => {
  return Subject.insertMany(subjects, {
    ordered: false
  })
    .then(response => resolve('Materie create con successo.'))
    .catch(e => reject(new Error('Impossibile creare le materie.')))
})

module.exports = {
  loadSubjects
}
