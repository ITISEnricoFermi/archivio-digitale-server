const mongoose = require('mongoose')

const {
  ObjectId
} = mongoose.Schema

const ChallengeSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: [true, 'La challenge deve essere associata ad un utente.'],
    minlength: 1,
    trim: true,
    ref: 'User'
  },
  challenge: {
    type: String,
    required: [true, 'La challenge deve avere un valore valido.'],
    minlength: 1
  }
})

const Challenge = mongoose.model('Challenge', ChallengeSchema)

module.exports = {
  Challenge
}
