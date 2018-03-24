const _ = require('lodash')

const {
  User
} = require('./../models/user')

// Verifica che sia stato eseguito l'accesso con un account valido
var authenticate = async (req, res, next) => {
  try {
    let user = await User.findByToken(req.header('x-auth') || req.cookies.token)
    req.user = _.pick(user, ['_id', 'firstname', 'lastname', 'email', 'privileges', 'accesses', 'img'])
    req.token = req.header('x-auth') || req.cookies.token
    next()
  } catch (e) {
    return res.status(401).send('Non è stato eseguito l\'accesso con un account valido.')
  }
}

var authenticateAdmin = (req, res, next) => {
  if (req.user.privileges !== 'admin') {
    return res.status(401).send('Non si detengono i privilegi necessari.')
  }

  next()
}

// Verifica che l'id sui cui si tenta di operare sia uguale all'id dell'utente loggato
var authenticateUser = (req, res, next) => {
  var _id = req.user._id
  var id = req.body.id || req.params.id

  if (id !== _id) {
    return res.statu(401).send('Non si detengono i privilegi necessari.')
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
