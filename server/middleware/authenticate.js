const _ = require('lodash')
const jwt = require('jsonwebtoken')

const {
  User
} = require('./../models/user')

// Verifica che sia stato eseguito l'accesso con un account valido
const authenticate = async (req, res, next) => {
  try {
    let token = req.header('x-auth') || req.cookies.token

    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    let user = await User.findById(decoded._id)

    req.user = _.pick(user, ['_id', 'firstname', 'lastname', 'email', 'privileges', 'accesses'])
    req.token = token
    return next()
  } catch (e) {
    return res.status(401).json({
      messages: ['Non è stato eseguito l\'accesso con un account valido.']
    })
  }
}

const authenticateAdmin = (req, res, next) => {
  if (req.user.privileges._id !== 'admin') {
    return res.status(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}

// Verifica che l'id sui cui si tenta di operare sia uguale all'id dell'utente loggato
var authenticateUser = (req, res, next) => {
  var _id = req.user._id
  var id = req.body.id || req.params.id

  if (id !== _id) {
    return res.statu(401).json({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}

var authenticateAccesses = (req, res, next) => {
  let query

  if (req.user.privileges === 'admin') {
    query = {}
  } else {
    query = {
      subject: { // <=====
        $in: req.user.accesses
      }
    }
  }

  req.query = query

  next()
}

module.exports = {
  authenticate,
  authenticateUser,
  authenticateAdmin,
  authenticateAccesses
}
