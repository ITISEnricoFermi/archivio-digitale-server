const crypto = require('crypto')

const {
  parseRegisterRequest,
  generateRegistrationChallenge,
  parseLoginRequest,
  generateLoginChallenge,
  verifyAuthenticatorAssertion
} = require('@webauthn/server')

const {
  Challenge
} = require('../models/challenge')

const {
  User
} = require('../models/user')

const userRepository = {
  users: [],
  create ({ id, email, challenge }) {
    this.users.push({ id, email, challenge })
  },
  findByChallenge (challenge) {
    return this.users.find(el => el.challenge === challenge)
  },
  addKeyToUser (user, key) {
    const index = this.users.indexOf(user)

    this.users[index].key = key
  },
  findByEmail (email) {
    return this.users.find(el => el.email === email)
  },
  updateUserChallenge (user, challenge) {
    const index = this.users.indexOf(user)
    this.users[index].challenge = challenge
  }
}

const requestRegister = async ({ user: { id, email, firstname, lastname } }, res) => {
  const challengeResponse = generateRegistrationChallenge({
    relyingParty: {
      // id: 'archivio.itisfermi.edu.it',
      name: 'Archivio Digitale'
    },
    user: {
      id,
      name: email,
      displayName: firstname + ' ' + lastname
    }
  })

  challengeResponse.authenticatorSelection = {
    residentKey: true
  }

  console.log(challengeResponse)

  // base64url(crypto.randomBytes(32))

  const challenge = new Challenge({
    user: id,
    challenge: challengeResponse.challenge
  })

  console.log(challenge)

  await challenge.save()

  res.status(200).json(challengeResponse)
}

const register = async ({ body: { credentials, name } }, res) => {
  const { key, challenge } = parseRegisterRequest(credentials)

  const [record] = await Challenge.find({
    challenge
  })

  if (!record) {
    return res.status(400).json({
      messages: ['Impossibile trovare la challenge.']
    })
  }

  const user = await User.findById(record.user._id)

  await user.updateOne({
    $push: {
      keys: {
        ...key,
        name
      }
    }
  })

  return res.status(200).send({
    messages: ['Utente registrato correttamente.']
  })
}

const login = async ({ body: { email } }, res) => {
  let user, assertionChallenge

  if (email) {
    user = userRepository.findByEmail(email)
    assertionChallenge = generateLoginChallenge(user.key)
  } else {
    assertionChallenge = {
      challenge: crypto.randomBytes(32).toString('hex')
    }
  }

  // userRepository.updateUserChallenge(user, assertionChallenge.challenge)

  res.status(200).json(assertionChallenge)
}

const loginChallenge = async ({ body }, res) => {
  const { challenge, keyId } = parseLoginRequest(body)

  if (!challenge) {
    return res.status(400).send()
  }

  const user = userRepository.findByChallenge(challenge)

  if (!user || !user.key || user.key.credID !== keyId) {
    return res.sendStatus(400)
  }

  const loggedIn = verifyAuthenticatorAssertion(body, user.key)

  return res.status(200).json({
    loggedIn
  })
}

module.exports = {
  requestRegister,
  register,
  loginChallenge,
  login
}
