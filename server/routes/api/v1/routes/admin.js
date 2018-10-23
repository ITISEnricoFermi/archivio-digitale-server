const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const path = require('path')
const sharp = require('sharp')
const mkdirp = require('mkdirp')

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

// Models
const {
  User
} = require('../../../../models/user')

/*
 * Utente loggato
 * Utente admin
 */
router.put('/users/', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'privileges', 'accesses'])

  body.state = 'active'

  const user = await (new User(body)).save()

  const sizes = [{
    path: 'xlg',
    xy: 1200
  }, {
    path: 'lg',
    xy: 800
  }, {
    path: 'md',
    xy: 500
  }, {
    path: 'sm',
    xy: 300
  }, {
    path: 'xs',
    xy: 100
  }]

  const dir = {
    folder: path.join(__dirname, '..', '..', '..', '..', 'public', 'pics', String(user._id)),
    default: path.join(__dirname, '..', '..', '..', '..', 'public', 'images', 'profile.svg')
  }

  mkdirp(dir.folder)

  for (let i = 0; i < sizes.length; i++) {
    await sharp(dir.default)
      .resize(sizes[i].xy, sizes[i].xy)
      .toFormat('jpeg')
      .toFile(path.join(dir.folder, sizes[i].path + '.jpeg'))
  }

  res.status(200).json(user)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.patch('/users/:id', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body.user, ['firstname', 'lastname', 'state', 'email', 'privileges', 'accesses'])

  let user = await User.findByIdAndUpdate(req.params.id, {
    $set: body
  })

  res.status(200).json(user)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/users/:id', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  res.status(200).json(await User.findById(req.params.id))
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/users/search/:key', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let regex = req.params.key.split(' ')
  regex = regex.join('|')

  let users = await User.find({
    $and: [{
      $or: [{
        firstname: {
          $regex: regex,
          $options: 'i'
        }
      }, {
        lastname: {
          $regex: regex,
          $options: 'i'
        }
      }]
    }, {
      _id: {
        $ne: req.user._id
      }
    }, {
      state: {
        $ne: 'pending'
      }
    }]
  })

  // let users = await User.find({
  //   $text: {
  //     $search: req.params.key
  //   },
  //   _id: {
  //     $ne: req.user._id
  //   },
  //   state: {
  //     $ne: 'pending'
  //   }
  // }, {
  //   score: {
  //     $meta: 'textScore'
  //   }
  // }).sort({
  //   score: {
  //     $meta: 'textScore'
  //   }
  // })

  if (users.length && req.params.key.length !== 0) {
    res.status(200).json(users)
  } else {
    res.status(404).json({
      messages: ['La ricerca non ha prodotto risultati.']
    })
  }
}))

/*
 * Utente loggato
 * Utente admin
 */
router.get('/requests/', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let users = await User.find({state: 'pending'})
  res.status(200).send(users)
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/acceptRequestById/', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  await User.findByIdAndUpdate(req.body._id, {
    $set: {
      state: 'active'
    }
  })
  res.status(200).send({
    messages: ['Richiesta d\'iscrizione accettata.']
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/refuseRequestById', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let user = await User.findByIdAndRemove(req.body._id)

  if (!user) {
    return res.status(400).send({
      messages: ['L\'utente non esiste']
    })
  }

  return res.status(200).send({
    messages: ['Richiesta d\'iscrizione rifiutata.']
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/resetPassword', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let password = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)

  let salt = await bcrypt.genSalt(10)
  let hash = await bcrypt.hash(password, salt)

  await User.findByIdAndUpdate(req.body._id, {
    password: hash
  })
  return res.status(200).send({
    password: password
  })
}))

/*
 * Utente loggato
 * Utente admin
 */
router.post('/toggleState/', authenticate, authenticateAdmin, asyncMiddleware(async (req, res) => {
  let body = _.pick(req.body, ['_id', 'state'])
  let user = await User.findByIdAndUpdate(body._id, {
    $set: {
      state: body.state === 'active' ? 'disabled' : 'active'
    }
  })
  res.status(200).json(user)
}))

module.exports = router
