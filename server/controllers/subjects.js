const {
  Subject
} = require('../models/subject')

const getSubjects = async (req, res) => {
  const subjects = await Subject.getSubjects()
  res.status(200).send(subjects)
}

const searchSubjects = async ({ params: { query } }, res) => {
  const regex = query.split(' ').join('|')

  const subjects = await Subject.find({
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
