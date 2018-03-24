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
  console.log('Classi create con successo.')
  await loadCollectionPermissions
  console.log('Permessi (collezioni) creati con successo.')
  await loadDocumentTypes
  console.log('Tipi (documenti) creati con successo.')
  await loadDocumentVisibilities
  console.log('Visibilità (documenti) create con successo.')
  await loadFaculties
  console.log('Specializzazioni create con successo.')
  await loadPrivileges
  console.log('Privilegi (utente) creati con successo.')
  await loadSections
  console.log('Sezioni create con successo.')
  await loadSubjects
  console.log('Materie create con successo.')
  await loadUsers
  console.log('Utenti creati con successo.')
}

loader()

console.log('Il database è stato popolato.')
