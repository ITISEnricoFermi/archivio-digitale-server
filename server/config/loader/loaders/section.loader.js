require('../../mongoose')

const {
  Section
} = require('../../../models/section')

const sections = require('../../seed/seeds/section.json')

const loadSections = new Promise((resolve, reject) => {
  return Section.insertMany(sections, {
    ordered: false
  })
    .then(response => resolve('Sezioni create con successo.'))
    .catch(e => reject(new Error('Impossibile creare le sezioni.')))
})

module.exports = {
  loadSections
}
