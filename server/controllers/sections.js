const {
  Section
} = require('../models/section')

const getSections = async (req, res) => {
  const sections = await Section.getSections()
  res.status(200).send(sections)
}

module.exports = {
  getSections
}
