const {
  Faculty
} = require('../models/faculty')

const getFaculty = async ({ params: { id } }, res) => {
  const faculty = await Faculty.findById(id)

  if (!faculty) {
    return res.status(404).json({
      messages: ['La specializzazione non esiste.']
    })
  }

  res.status(200).json(faculty)
}

const getFaculties = async (req, res) => {
  const faculties = await Faculty.getFaculties()
  res.status(200).json(faculties)
}

module.exports = {
  getFaculty,
  getFaculties
}
