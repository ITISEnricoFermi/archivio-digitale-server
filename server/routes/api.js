const express = require('express')
const router = express.Router()

const history = require('connect-history-api-fallback')
router.use(history())

// Middleware
const {
  authenticate
} = require('./../middleware/authenticate')

const {
  asyncMiddleware
} = require('../middleware/async')

// Models
const {
  DocumentType
} = require('./../models/document_type')

const {
  Faculty
} = require('./../models/faculty')

const {
  DocumentVisibility
} = require('./../models/document_visibility')

const {
  Section
} = require('./../models/section')

const {
  Subject
} = require('./../models/subject')

const {
  Privilege
} = require('./../models/privilege')

const {
  Class
} = require('./../models/class')

const {
  CollectionPermission
} = require('./../models/collection_permission')

const {
  User
} = require('./../models/user')

/*
 * Utente non loggato
 */
router.get('/getFaculties', asyncMiddleware(async (req, res) => {
  let faculties = await Faculty.getFaculties()
  res.status(200).send(faculties)
}))

/*
 * Utente non loggato
 */
router.get('/getSubjects', asyncMiddleware(async (req, res) => {
  let subjects = await Subject.getSubjects()
  res.status(200).send(subjects)
}))

/*
 * Utente non loggato
 */
router.get('/getDocumentTypes', asyncMiddleware(async (req, res) => {
  let documentTypes = await DocumentType.getDocumentTypes()
  res.status(200).send(documentTypes)
}))

/*
 * Utente non loggato
 */
router.get('/getDocumentVisibilityList', asyncMiddleware(async (req, res) => {
  let visibilities = await DocumentVisibility.getDocumentVisibility()
  res.status(200).send(visibilities)
}))

/*
 * Utente non loggato
 */
router.get('/getSections', asyncMiddleware(async (req, res) => {
  let sections = await Section.getSections()
  res.status(200).send(sections)
}))

/*
 * Utente non loggato
 */
router.get('/getPrivileges', asyncMiddleware(async (req, res) => {
  let privileges = await Privilege.getPrivileges()
  res.status(200).send(privileges)
}))

/*
 * Utente non loggato
 */
router.get('/getClasses', asyncMiddleware(async (req, res) => {
  let classes = await Class.getClasses()
  res.status(200).send(classes)
}))

/*
 * Utente non loggato
 */
router.get('/getCollectionsPermissions', asyncMiddleware(async (req, res) => {
  let permissions = await CollectionPermission.getPermissions()
  res.status(200).send(permissions)
}))

/*
 * Utente loggato
 */
router.get('/getUsers', authenticate, asyncMiddleware(async (req, res) => {
  let users = await User.getUsers()
  res.status(200).send(users)
}))

// router.get('/trends', authenticate, (req, res) => {
//   Document.aggregate([{
//     $group: {
//       _id: '$subject',
//       count: {
//         $sum: 1
//       }
//     }
//   }])
//     .then((documents) => {
//       let dataset = {
//         labels: [],
//         datasets: [{
//           label: 'Subjects',
//           backgroundColor: '#f87979',
//           data: []
//         }]
//       }
//
//       for (let i = 0; i < documents.length; i++) {
//         dataset.labels.push(documents[i]._id)
//         dataset.datasets[0].data.push(documents[i].count)
//       }
//
//       res.status(200).send(dataset)
//     })
//     .catch((e) => {
//       res.status(500).send('Impossibile recuperare i trend.')
//     })
// })

module.exports = router
