const {
  Grade
} = require('../models/grade')

const getGrade = async ({ params: { id } }, res) => {
  const grade = await Grade.findById(id)

  if (!grade) {
    return res.status(404).json({
      messages: ['La classe non esiste.']
    })
  }

  res.status(200).json(grade)
}

const getGrades = async (req, res) => {
  const classes = await Grade.getGrades()
  res.status(200).json(classes)
}

module.exports = {
  getGrade,
  getGrades
}
