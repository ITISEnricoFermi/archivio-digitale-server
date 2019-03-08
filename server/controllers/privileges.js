const {
  Privilege
} = require('../models/privilege')

const getPrivileges = async (req, res) => {
  let privileges = await Privilege.getPrivileges()
  res.status(200).send(privileges)
}

module.exports = {
  getPrivileges
}
