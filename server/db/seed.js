import loadClasses from './loaders/class.loader'
import loadCollectionPermissions from './loaders/collectionPermission.loader'
import loadDocumentTypes from './loaders/documentType.loader'
import loadDocumentVisibilities from './loaders/documentVisibility.loader'
import loadFaculties from './loaders/faculty.loader'
import loadPrivileges from './loaders/privilege.loader'
import loadSections from './loaders/section.loader'
import loadSubjects from './loaders/subject.loader'
import loadUsers from './loaders/user.loader'

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
