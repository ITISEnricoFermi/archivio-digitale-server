const {
  Section
} = require('../models/section')

const getSection = async ({ params: { id } }, res) => {
  const section = await Section.findById(id)

  if (!section) {
    return res.status(404).json({
      messages: ['La sezione non esiste.']
    })
  }

  res.status(200).json(section)
}

const getSections = async (req, res) => {
  const sections = await Section.getSections()
  res.status(200).json(sections)
}

module.exports = {
  getSection,
  getSections
}
