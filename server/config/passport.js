const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

// Models
const {
  User
} = require('../models/user')

const login = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
},
async (username, password, done) => {
  try {
    const user = await User.findByCredentials(username, password)
    if (!user) {
      return done(null, false)
    }
    done(null, user)
  } catch (e) {
    done(e)
  }
})

const bearer = new BearerStrategy(
  async (token, done) => {
    let user

    try {
      user = await User.findByToken(token)
    } catch (e) {
      return done(e)
    }

    if (!user) {
      return done(null, false, 'Non è stato eseguito l\'accesso con un account valido.')
    }
    done(null, user)
  }
)

module.exports = {
  bearer,
  login
}
