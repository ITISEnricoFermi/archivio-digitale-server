const {
  Privilege
} = require('../models/privilege')

const getPrivilege = async ({ params: { id } }, res) => {
  const privilege = await Privilege.findById(id)

  if (!privilege) {
    return res.status(404).json({
      messages: ['Il privilegio non esiste.']
    })
  }

  res.status(200).json(privilege)
}

const getPrivileges = async (req, res) => {
  const privileges = await Privilege.getPrivileges()
  res.status(200).json(privileges)
}

module.exports = {
  getPrivilege,
  getPrivileges
}
