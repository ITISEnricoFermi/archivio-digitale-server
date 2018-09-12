const passport = require('passport')

// Config
const {
  bearer
} = require('../config/passport')

passport.use('bearer', bearer)

const authenticate = (req, res, next) => passport.authenticate('bearer', {
  session: false,
  failureFlash: true
}, (err, user, info) => {
  if (err) {
    return res.status(500).json({
      message: 'Si è verificato un errore durante la verifica dell\'utente.'
    })
  } else if (!user) {
    return res.status(401).json({
      message: info
    })
  } else {
    req.user = user
    return next()
  }
})(req, res, next)

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
