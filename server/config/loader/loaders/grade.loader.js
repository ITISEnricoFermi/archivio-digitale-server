require('../../mongoose')

const {
  Grade
} = require('../../../models/grade')

const grades = require('../../seed/seeds/grade.json')

const loadGrades = new Promise((resolve, reject) => {
  return Grade.insertMany(grades, {
    ordered: false
  })
    .then(response => resolve('Classi create con successo.'))
    .catch(e => reject(new Error('Impossibile creare le classi.')))
})

module.exports = {
  loadGrades
}
