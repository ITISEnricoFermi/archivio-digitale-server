const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
  firstname: { // OK
    type: String,
    required: true,
    minlength: 1,
    unique: false,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un nome valido.'
    }
  },
  lastname: { // OK
    type: String,
    required: true,
    minlength: 1,
    unique: false,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un cognome valido.'
    }
  },
  email: { // CONTROLLARE
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} non è un indirizzo email valido.'
    }
  },
  password: { // CONTROLLARE
    type: String,
    required: true,
    minlength: 6
  },
  // img: { // OK
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 1,
  //   default: '../static/elements/profile.svg'
  // },
  // accesses: [{
  //   _id: {
  //     type: String,
  //     required: false,
  //     trim: true,
  //     minlength: 1,
  //     validate: {
  //       validator: validator.isAlpha,
  //       message: "{VALUE} non è un accesso valido."
  //     },
  //     ref: "Subject"
  //   }
  // }],
  accesses: [{ // OK
    type: String,
    required: false,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un accesso valido.'
    },
    ref: 'Subject'
  }],
  privileges: { // CONTROLLARE
    type: String,
    required: false,
    trim: true,
    minlength: 1,
    unique: false,
    default: 'user',
    // validate: {
    //   validator: validator.isAlpha,
    //   message: "{VALUE} non è un privilegio valido."
    // },
    ref: 'Privilege'
  },
  state: { // OK
    type: String,
    reuired: true,
    trim: true,
    minlength: 1,
    unique: false,
    default: 'pending',
    validate: {
      validator: validator.isAlpha,
      message: '{VALUE} non è un stato valido.'
    }
  }
})

UserSchema.methods.toJSON = function () {
  var user = this
  var userObject = user.toObject()

  return _.pick(userObject, ['_id', 'firstname', 'lastname', 'email', 'state', 'privileges', 'accesses'])
}

UserSchema.methods.generateAuthToken = async function () {
  try {
    let user = this
    let access = 'auth'
    let token = jwt.sign({
      _id: user._id.toHexString(),
      access
    }, process.env.JWT_SECRET, { expiresIn: '1d' }).toString()

    return Promise.resolve(token)
  } catch (e) {
    return Promise.reject(e)
  }
}

UserSchema.statics.findByToken = function (token) {
  var User = this
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
      return User.findById(decoded._id)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

UserSchema.statics.findByEmail = function (email) {
  var User = this

  return User.findOne({
    email
  })
    .then((user) => {
      return Promise.resolve(user)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

UserSchema.statics.findByCredentials = async function (email, password) {
  var User = this

  try {
    let user = await User.findOne({
      email
    })

    if (!user) {
      return Promise.reject(new Error('Nessun utente registrato con l\'email inserita.'))
    }

    if (user.state !== 'active') {
      return Promise.reject(new Error('Il tuo account è stato disabilitato.'))
    }

    if (await bcrypt.compare(password, user.password)) {
      return Promise.resolve(user)
    } else {
      return Promise.reject(new Error('Password errata'))
    }
  } catch (e) {
    return Promise.reject(e)
  }

  // return User.findOne({
  //   email
  // })
  //   .then((user) => {
  //     if (!user) {
  //       return Promise.reject(new Error('Nessun utente registrato con l\'email inserita.'))
  //     }
  //
  //     if (user.state !== 'active') {
  //       return Promise.reject(new Error('Il tuo account è stato disabilitato.'))
  //     }
  //
  //     return bcrypt.compare(password, user.password)
  //       .then((result) => {
  //         if (result) {
  //           return Promise.resolve(user)
  //         } else {
  //           return Promise.reject(new Error('Password errata'))
  //         }
  //       })
  //       .catch((e) => {
  //         return Promise.reject(e)
  //       })
  //   })
}

UserSchema.statics.getUsers = function () {
  var User = this

  return User.find({}, {
    accesses: false,
    privileges: false,
    state: false,
    email: false,
    password: false
  })
    .then((results) => {
      return Promise.resolve(results)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

UserSchema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) {
    return next()
  }

  return bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(user.password, salt)
        .then((hash) => {
          user.password = hash
          next()
        })
    })
    .catch((e) => {
      return Promise.reject(e)
    })
})

UserSchema.pre('find', function (next) {
  this.populate('privileges')
    .populate('accesses')

  next()
})

UserSchema.pre('findOne', function (next) {
  this.populate('privileges')
    .populate('accesses')

  next()
})

UserSchema.index({
  firstname: 'text',
  lastname: 'text'
})

var User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
