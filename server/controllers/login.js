const login = async ({ user }, res) => {
  const token = await user.generateAuthToken()
  res.status(200).json({
    token
  })
}

module.exports = {
  login
}
