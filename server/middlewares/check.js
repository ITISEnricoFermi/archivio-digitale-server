const {
  validationResult,
  param
} = require('express-validator/check')

const {
  User
} = require('../models/user')

const checkErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: errors.array().map(el => el.msg) })
  }

  return next()
}

const checkUserById = param('id')
  .isMongoId().withMessage('ID non valido.')
  .custom(value => User.findById(value)
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('L\'utente non esiste.'))
      }
    }))

module.exports = {
  checkErrors,
  checkUserById
}
