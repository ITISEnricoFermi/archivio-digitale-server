require('../../lib/mongoose')

const {
  Faculty
} = require('../../../models/faculty')

const faculties = require('../../seed/seeds/faculty.json')

const loadFaculties = new Promise((resolve, reject) => {
  return Faculty.insertMany(faculties, {
    ordered: false
  })
    .then(response => resolve('Specializzazioni create con successo.'))
    .catch(e => reject(new Error('Impossibile creare le specializzazioni.')))
})

module.exports = {
  loadFaculties
}
