require('../../../lib/mongoose')

const {
  DocumentType
} = require('../../../models/document_type')

const documentTypes = require('../../seed/seeds/documentType.json')

const loadDocumentTypes = new Promise((resolve, reject) => {
  return DocumentType.insertMany(documentTypes, {
    ordered: false
  })
    .then(response => resolve('Tipi (documenti) creati con successo.'))
    .catch(e => reject(new Error('Impossibile creare i tipo (documenti).')))
})

module.exports = {
  loadDocumentTypes
}
