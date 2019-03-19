const login = async (req, res) => {
  const {user} = req
  const token = await user.generateAuthToken()
  res.status(200).json({
    token
  })
}

module.exports = {
  login
}
