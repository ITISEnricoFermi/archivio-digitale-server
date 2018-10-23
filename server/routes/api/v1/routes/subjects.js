const express = require('express')
const router = express.Router()

// Middleware
const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Model
const {
  Subject
} = require('../../../../models/subject')

/*
 * Utente non loggato
 */
router.get('/', asyncMiddleware(async (req, res) => {
  let subjects = await Subject.getSubjects()
  res.status(200).send(subjects)
}))

router.post('/search/partial/', asyncMiddleware(async (req, res) => {
  let query = req.body.query
  let regex = query.split(' ').join('|')

  let subjects = await Subject.find({
    subject: {
      $regex: regex,
      $options: 'i'
    }
  }, {
    __v: false
  }).limit(10)

  res.status(200).json(subjects)
}))

module.exports = router
