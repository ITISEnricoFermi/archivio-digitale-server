const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1
    // validate: new RegExp("[a-z]àáâäãåąçčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžßŒÆ∂ð,\. '-", 'gi')
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1
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
      ref: 'Subject'
    }],
    required: true,
    minlength: 1
  },
  privileges: {
    type: String,
    trim: true,
    minlength: 1,
    default: 'user',
    ref: 'Privilege'
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

const User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
