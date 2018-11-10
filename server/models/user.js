const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const validator = require('validator')

const {
  Privilege
} = require('../models/privilege')

const {
  Subject
} = require('../models/subject')

var UserSchema = new mongoose.Schema({
  firstname: { // OK
    type: String,
    required: true,
    minlength: 1
    // validate: new RegExp("[a-z]àáâäãåąçčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžßŒÆ∂ð,\. '-", 'gi')
  },
  lastname: { // OK
    type: String,
    required: true,
    minlength: 1
    // validate: new RegExp("[a-z]àáâäãåąçčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžßŒÆ∂ð,\. '-", 'gi')
  },
  email: { // OK
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} non è un indirizzo email valido.'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  accesses: {
    type: [{
      type: String,
      trim: true,
      // unique: true,
      ref: 'Subject',
      validate: [async (value) => {
        let subject = await Subject.findById(value)
        if (!subject) return false
      }, '\'{VALUE}\' non è un permesso valido.']
    }],
    required: true,
    minlength: 1
  },
  privileges: {
    type: String,
    trim: true,
    minlength: 1,
    default: 'user',
    ref: 'Privilege',
    validate: [async (value) => {
      let privilege = await Privilege.findById(value)
      if (!privilege) {
        return false
      }
    }, 'Il privilegio inserito non è valido.']
  },
  state: {
    type: String,
    reuired: true,
    trim: true,
    minlength: 1,
    default: 'pending'
  }
})

UserSchema.methods.toJSON = function () {
  const user = this
  const {
    _id,
    firstname,
    lastname,
    email,
    state,
    privileges,
    accesses
  } = user.toObject()

  return {
    _id,
    firstname,
    lastname,
    email,
    state,
    privileges,
    accesses
  }
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
      const e = new Error('Nessun utente registrato con l\'email inserita.')
      e.name = 'bad_email'
      return Promise.reject(e)
    }

    if (user.state !== 'active') {
      const e = new Error('Il tuo account è stato disabilitato.')
      e.name = 'account_disabled'
      return Promise.reject(e)
    }

    if (await bcrypt.compare(password, user.password)) {
      return Promise.resolve(user)
    } else {
      const e = new Error('La password inserita non è corretta.')
      e.name = 'bad_password'
      return Promise.reject(e)
    }
  } catch (e) {
    return Promise.reject(e)
  }
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

  // nome
  user.firstname = _.startCase(_.lowerCase(user.firstname))

  // cognome
  user.lastname = _.startCase(_.lowerCase(user.lastname))

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
