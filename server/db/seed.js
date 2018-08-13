const colors = require('colors')

const {
  loadClasses
} = require('./loaders/grade.loader')

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
  if (await loadClasses()) {
    console.log('Classi create con successo.'.yellow)
  } else {
    console.log('Impossibile creare le classi.'.red)
    return process.exit(1)
  }

  if (await loadCollectionPermissions()) {
    console.log('Permessi (collezioni) creati con successo.'.yellow)
  } else {
    console.log('Impossibile creare i permessi'.red)
    return process.exit(1)
  }

  if (await loadDocumentTypes()) {
    console.log('Tipi (documenti) creati con successo.'.yellow)
  } else {
    console.log('Impossibile creare i tipo (documenti).'.red)
    return process.exit(1)
  }

  if (await loadDocumentVisibilities()) {
    console.log('Visibilità (documenti) create con successo.'.yellow)
  } else {
    console.log('Impossibile creare le visibilità (documenti).'.red)
    return process.exit(1)
  }

  if (await loadFaculties()) {
    console.log('Specializzazioni create con successo.'.yellow)
  } else {
    console.log('Impossibile creare le specializzazioni.'.red)
    return process.exit(1)
  }

  if (await loadPrivileges()) {
    console.log('Privilegi (utenti) creati con successo.'.yellow)
  } else {
    console.log('Impossibile creare i privilegi (utenti).'.red)
    return process.exit(1)
  }

  if (await loadSections()) {
    console.log('Sezioni create con successo.'.yellow)
  } else {
    console.log('Impossibile creare le sezioni.'.red)
    return process.exit(1)
  }

  if (await loadSubjects()) {
    console.log('Materie create con successo.'.yellow)
  } else {
    console.log('Impossibile creare le materie.'.red)
    return process.exit(1)
  }

  if (await loadUsers()) {
    console.log('Utenti creati con successo.'.yellow)
  } else {
    console.log('Impossibile creare gli utenti.'.red)
    return process.exit(1)
  }
}

loader()
  .then(() => {
    console.log('Il database è stato popolato.'.green)
    return process.exit()
  }).catch(e => process.exit(1))
