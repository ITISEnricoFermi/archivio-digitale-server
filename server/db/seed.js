const colors = require('colors')

const {
  loadClasses
} = require('./loaders/class.loader')

const {
  loadCollectionPermissions
} = require('./loaders/collectionPermission.loader')

const {
  loadDocumentTypes
} = require('./loaders/documentType.loader')

const {
  loadDocumentVisibilities
} = require('./loaders/documentVisibility.loader')

const {
  loadFaculties
} = require('./loaders/faculty.loader')

const {
  loadPrivileges
} = require('./loaders/privilege.loader')

const {
  loadSections
} = require('./loaders/section.loader')

const {
  loadSubjects
} = require('./loaders/subject.loader')

const {
  loadUsers
} = require('./loaders/user.loader')

let loader = async () => {
  await loadClasses
  console.log('Classi create con successo.'.yellow)
  await loadCollectionPermissions
  console.log('Permessi (collezioni) creati con successo.'.yellow)
  await loadDocumentTypes
  console.log('Tipi (documenti) creati con successo.'.yellow)
  await loadDocumentVisibilities
  console.log('Visibilità (documenti) create con successo.'.yellow)
  await loadFaculties
  console.log('Specializzazioni create con successo.'.yellow)
  await loadPrivileges
  console.log('Privilegi (utente) creati con successo.'.yellow)
  await loadSections
  console.log('Sezioni create con successo.'.yellow)
  await loadSubjects
  console.log('Materie create con successo.'.yellow)
  await loadUsers
  console.log('Utenti creati con successo.'.yellow)
  console.log('Il database è stato popolato.'.green)
}

loader()
