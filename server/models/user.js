const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const validator = require('validator')
const xregexp = require('xregexp')

const {
  Privilege
} = require('../models/privilege')

const {
  Subject
} = require('../models/subject')

const reg = xregexp('^\\pL+$')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Inserire il nome.'],
    minlength: 1,
    validate: {
      validator (value) {
        return reg.test(value)
      },
      message: 'Il nome non è valido.'
    }
  },
  lastname: {
    type: String,
    required: [true, 'Inserire il cognome.'],
    minlength: 1,
    validate: {
      validator (value) {
        return reg.test(value)
      },
      message: 'Il cognome non è valido.'
    }
  },
  email: {
    type: String,
    required: [true, 'Inserire l\'indirizzo email.'],
    unique: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: 'L\'indirizzo email non è valido.'
    }
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria.'],
    trim: true,
    minlength: 6
  },
  accesses: {
    type: [{
      type: String,
      trim: true,
      // unique: true,
      ref: 'Subject',
      validate: [{
        async validator (value) {
          const subject = await Subject.findById(value)
          if (!subject) return false
        },
        message: 'Uno dei permessi non è valido.'
      }]
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
    validate: [{
      async validator (value) {
        const privilege = await Privilege.findById(value)
        if (!privilege) return false
      },
      message: 'Il privilegio non è valido.'
    }]
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
  const user = this
  const access = 'auth'
  return jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET, { expiresIn: '1d' }).toString()
}

UserSchema.statics.findByToken = function (token) {
  const User = this
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
  const User = this

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
  const User = this

  try {
    let user = await User.findOne({
      email
    })

    if (!user) {
      const e = new Error('Nessun utente registrato con l\'email inserita.')
      e.name = 'bad_email'
      return Promise.reject(e)
    }

    if (user.state === 'disabled') {
      const e = new Error('Il tuo account è stato disabilitato.')
      e.name = 'account_disabled'
      return Promise.reject(e)
    } else if (user.state === 'pending') {
      const e = new Error('Il tuo account è in attesa di verifica.')
      e.name = 'account_pending'
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
  const User = this

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
  const user = this

  // originariamente startCase ma effettua il deburring, vedere lodash v5
  user.firstname = _.upperFirst(user.firstname)
  user.lastname = _.upperFirst(user.lastname)

  if (!user.isModified('password')) {
    return next()
  }

  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash
      next()
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

const User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
