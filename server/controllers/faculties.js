const {
  Faculty
} = require('../models/faculty')

const getFaculties = async (req, res) => {
  const faculties = await Faculty.getFaculties()
  res.status(200).send(faculties)
}

module.exports = {
  getFaculties
}
