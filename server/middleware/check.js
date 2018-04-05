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
  Document
} = require('../models/document')

const {
  DocumentType
} = require('../models/document_type')

const {
  DocumentVisibility
} = require('../models/document_visibility')

const {
  CollectionPermission
} = require('../models/collection_permission')

let checkErrors = (req, res, next) => {
  if (req.messages.length !== 0) {
    return res.status(400).json({
      messages: req.messages
    })
  }

  next()
}

let adminCheckOldUser = asyncMiddleware(async (req, res, next) => {
  let user = req.body.user

  if (user.firstname == null || user.firstname.length < 1) {
    req.messages.push('Il campo del nome è vuoto.')
  } else {
    console.log(user.firstname)
    user.firstname = _.startCase(_.lowerCase(user.firstname))
    user.firstname = validator.trim(validator.whitelist(user.firstname, re))
    console.log(user.firstname)
  }

  if (user.lastname == null || user.lastname.length < 1) {
    req.messages.push('Il campo del cognome è vuoto.')
  } else {
    console.log(user.lastname)
    user.lastname = _.startCase(_.lowerCase(user.lastname))
    user.lastname = validator.trim(validator.whitelist(user.lastname, re))
    console.log(user.lastname)
  }

  if (user.email == null || user.email.length < 1) {
    req.messages.push('Il campo dell\'email è vuoto.')
  } else if (!validator.isEmail(user.email)) {
    req.messages.push('L\'email inserita non è valida.')
  } else {
    let currentUserEmail = await User.findById(user._id).email
    let dbEmail = await User.findByEmail(user.email).email
    if (dbEmail && dbEmail !== currentUserEmail) {
      req.messages.push('Un utente è già registrato con l\'email inserita.')
    }
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
    let subjects = await Subject.count({
      _id: {
        $in: user.accesses.map(access => access._id)
      }
    })

    if (subjects !== user.accesses.length) {
      req.messages.push('Uno dei permessi non è valido.')
    }
  }

  req.body.user = user
  next()
})

let adminCheckNewUser = asyncMiddleware(async (req, res, next) => {
  let user = req.body.user

  if (user.firstname == null || user.firstname.length < 1) {
    req.messages.push('Il campo del nome è vuoto.')
  } else {
    console.log(user.firstname)
    user.firstname = _.startCase(_.lowerCase(user.firstname))
    user.firstname = validator.trim(validator.whitelist(user.firstname, re))
    console.log(user.firstname)
  }

  if (user.lastname == null || user.lastname.length < 1) {
    req.messages.push('Il campo del cognome è vuoto.')
  } else {
    console.log(user.lastname)
    user.lastname = _.startCase(_.lowerCase(user.lastname))
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
    let subjects = await Subject.count({
      _id: {
        $in: user.accesses.map(access => access._id)
      }
    })

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
    collection.documentCollection = _.upperFirst(collection.documentCollection)
  }

  if (collection.permissions == null || collection.permissions.length < 1) {
    req.messages.push('Il campo dei permessi di modifica è vuoto.')
  } else {
    let permissions = await CollectionPermission.count({
      _id: collection.permissions
    })

    if (!permissions) {
      req.messages.push('Uno dei permessi di modifica non è valido.')
    }
  }

  if ((collection.permissions !== null || collection.permissions.length > 0) && (collection.authorizations !== null || collection.authorizations.length > 0)) {
    let authorizations = await User.count({
      _id: {
        $in: collection.authorizations.map(authorization => authorization._id)
      }
    })

    if (authorizations !== collection.authorizations.length) {
      req.messages.push('Una delle autorizzazioni non è valida.')
    }
  }

  if (collection.documents) {
    let documents = await Document.count({
      _id: {
        $in: collection.documents.map(document => document._id)
      }
    })

    if (documents !== collection.documents.length) {
      req.messages.push('Uno dei documenti non è valido.')
    }
  }

  req.body.collection = collection
  next()
})

let checkDocument = asyncMiddleware(async (req, res, next) => {
  let document = req.body.document

  if (document.name == null || document.name.length < 1) {
    req.messages.push('Il campo del nome è vuoto.')
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
  }

  req.body.document = document
  next()
})

let checkOldUser = asyncMiddleware(async (req, res, next) => {
  let user = req.body.user

  if (user.email == null || user.email.length < 1) {
    req.messages.push('Il campo dell\'email è vuoto.')
  } else if (!validator.isEmail(user.email)) {
    req.messages.push('L\'email inserita non è valida.')
  } else {
    let dbUser = await User.findByEmail(user.email)
    if (dbUser && String(req.user._id) !== String(dbUser._id)) {
      req.messages.push('Un utente è già registrato con l\'email inserita.')
    }
  }

  if (validator.isEmpty(user.passwords.old) && validator.isEmpty(user.passwords.new)) {
    return next()
  }

  if (validator.isEmpty(user.passwords.new) || user.passwords.new.length < 6) {
    req.messages.push('Password non valida o troppo breve. (min. 6).')
  } else if (user.passwords.old === user.passwords.new) {
    req.messages.push('La password attuale è uguale a quella nuova.')
  } else if (!await User.findByCredentials(req.user.email, user.passwords.old)) {
    req.messages.push('La password attuale non è corretta.')
  } else {
    user.password = user.passwords.new
    delete user.passwords
  }

  req.body.user = user
  next()
})

module.exports = {
  adminCheckOldUser,
  adminCheckNewUser,
  checkCollection,
  checkDocument,
  checkErrors,
  checkOldUser
}
