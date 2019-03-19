const logged = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}

module.exports = logged
