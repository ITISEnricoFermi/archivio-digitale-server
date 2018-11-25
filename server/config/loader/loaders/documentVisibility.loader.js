require('../../mongoose')

const {
  DocumentVisibility
} = require('../../../models/document_visibility')

const documentVisibilities = require('../../seed/seeds/documentVisibility.json')

const loadDocumentVisibilities = new Promise((resolve, reject) => {
  return DocumentVisibility.insertMany(documentVisibilities, {
    ordered: false
  })
    .then(response => resolve('Visibilità (documenti) create con successo.'))
    .catch(e => reject(new Error('Impossibile creare le visibilità (documenti).')))
})

module.exports = {
  loadDocumentVisibilities
}
