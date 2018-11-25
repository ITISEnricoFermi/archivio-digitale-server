const {
  loadGrades
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

module.exports = Promise.all([loadGrades, loadCollectionPermissions, loadDocumentTypes, loadDocumentVisibilities, loadFaculties, loadPrivileges, loadSections, loadSubjects])
