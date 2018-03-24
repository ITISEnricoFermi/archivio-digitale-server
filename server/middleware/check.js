const validator = require('validator')
const _ = require('lodash')

const re = new RegExp("[a-z]àáâäãåąçčćęèéêëėįìíîïłńñòóôöõøùúûüųūÿýżźñçčšžßŒÆ∂ð,\. '-", 'gi')

const {
  asyncMiddleware
} = require('./async')

// Models
const {
  User
} = require('../models/user')

const {
  Privilege
} = require('../models/privilege')

const {
  Faculty
} = require('../models/faculty')

const {
  Subject
} = require('../models/subject')

const {
  DocumentType
} = require('../models/document_type')

const {
  DocumentVisibility
} = require('../models/document_visibility')

let checkErrors = (req, res, next) => {
  if (req.messages.length !== 0) {
    return res.status(400).json({
      messages: req.messages
    })
  }

  next()
}

let adminCheckUser = asyncMiddleware(async (req, res, next) => {
  let user = req.body.user

  if (user.firstname == null || user.firstname.length < 1) {
    req.messages.push('Il campo del nome è vuoto.')
  } else {
    console.log(user.firstname)
    user.firstname = validator.trim(validator.whitelist(user.firstname, re))
    console.log(user.firstname)
  }

  if (user.lastname == null || user.lastname.length < 1) {
    req.messages.push('Il campo del cognome è vuoto.')
  } else {
    console.log(user.lastname)
    user.lastname = validator.trim(validator.whitelist(user.lastname, re))
    console.log(user.lastname)
  }

  if (user.email == null || user.email.length < 1) {
    req.messages.push('Il campo dell\'email è vuoto.')
  } else if (!validator.isEmail(user.email)) {
    req.messages.push('L\'email inserita non è valida.')
  } else {
    let dbUser = await User.findByEmail(user.email)
    if (dbUser) {
      req.messages.push('Un utente è già registrato con l\'email inserita.')
    }
  }

  if (user.password == null || user.password.length < 1) {
    req.messages.push('Il campo della password è vuoto.')
  } else if (user.password.length < 6) {
    req.messages.push('La password deve essere lunga almeno 6 caratteri.')
  }

  if (user.privileges == null || user.privileges.length < 1) {
    req.messages.push('Il campo dei privilegi è vuoto.')
  } else {
    let privilege = await Privilege.findById(user.privileges)
    if (!privilege) {
      req.messages.push('Il privilegio inserito non è valido.')
    }
  }

  if (user.accesses == null || user.accesses.length < 1) {
    req.messages.push('Il campo dei permessi è vuoto.')
  } else {
    let subjects = Subject.find({
      accesses: {
        $in: user.accesses
      }
    }).count()

    if (subjects !== user.accesses.length) {
      req.messages.push('Uno dei permessi non è valido.')
    }
  }

  req.body.user = user
  next()
})

let checkCollection = asyncMiddleware(async (req, res, next) => {
  let collection = req.body.collection

  if (collection.documentCollection == null || collection.documentCollection.length < 1) {
    req.messages.push('Il campo del nome della collezione è vuoto.')
  } else {
    console.log(collection.documentCollection)
    collection.documentCollection = _.upperFirst(validator.escape(collection.documentCollection))
    console.log(collection.documentCollection)
  }

  req.body.collection = collection
  next()
})

let checkDocument = asyncMiddleware(async (req, res, next) => {
  let document = req.body.document

  if (document.name == null || document.name.length < 1) {
    req.messages.push('Il campo del nome è vuoto.')
  } else {
    document.name = validator.escape(document.name)
  }

  if (document.type == null || document.type.length < 1) {
    req.messages.push('Il campo del tipo è vuoto.')
  } else {
    let documentType = await DocumentType.findById(document.type)
    if (!documentType) {
      req.messages.push('Il tipo non è valido.')
    }
  }

  if (document.faculty == null || document.faculty.length < 1) {
    req.messages.push('Il campo della specializzazione è vuoto.')
  } else {
    let faculty = await Faculty.findById(document.faculty)
    if (!faculty) {
      req.messages.push('La specializzazione non è valida.')
    }
  }

  if (document.subject == null || document.subject.length < 1) {
    req.messages.push('Il campo della materia è vuoto.')
  } else {
    let subject = await Subject.findById(document.subject)
    if (!subject) {
      req.messages.push('La materia non è valida.')
    }
  }

  if (document.visibility == null || document.visibility.length < 1) {
    req.messages.push('Il campo della visibilità è vuoto.')
  } else {
    let documentVisibility = await DocumentVisibility.findById(document.visibility)
    if (!documentVisibility) {
      req.messages.push('La visibilità non è valida.')
    }
  }

  if (document.description == null || document.visibility.length < 1) {
    req.messages.push('Il campo della descrizione è vuoto.')
  } else {
    document.description = validator.escape(document.description)
  }

  req.body.document = document
  next()
})

module.exports = {
  adminCheckUser,
  checkCollection,
  checkDocument,
  checkErrors
}
