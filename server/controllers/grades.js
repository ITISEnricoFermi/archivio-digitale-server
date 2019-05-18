const {
  Grade
} = require('../models/grade')

const getGrades = async (req, res) => {
  const classes = await Grade.getGrades()
  res.status(200).send(classes)
}

module.exports = {
  getGrades
}
