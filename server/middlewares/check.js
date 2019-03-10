const {
  validationResult
} = require('express-validator/check')

module.exports = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors.array().map(el => el.msg) })
  }

  return next()
}
