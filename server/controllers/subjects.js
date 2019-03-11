const {
  Subject
} = require('../models/subject')

const getSubjects = async (req, res) => {
  let subjects = await Subject.getSubjects()
  res.status(200).send(subjects)
}

const searchSubjects = async (req, res) => {
  let query = req.params.query
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
}

module.exports = {
  getSubjects,
  searchSubjects
}
