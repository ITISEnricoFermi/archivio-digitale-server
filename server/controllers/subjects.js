const {
  Subject
} = require('../models/subject')

const getSubject = async ({ params: { id } }, res) => {
  const subject = await Subject.findById(id)

  if (!subject) {
    return res.status(404).json({
      messages: ['La materia non esiste.']
    })
  }

  res.status(200).json(subject)
}

const getSubjects = async (req, res) => {
  const subjects = await Subject.getSubjects()
  res.status(200).json(subjects)
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
  getSubject,
  getSubjects,
  searchSubjects
}
