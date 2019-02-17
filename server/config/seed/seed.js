const { yellow, green, red } = require('colors')
const mongoose = require('../mongoose')

mongoose.connection.once('open', async () => {
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.log(red(err.message))
      return process.exit()
    }

    if (collections.length) {
      console.log(green('Il database è già stato popolato.'))
      return process.exit()
    }

    const loader = require('../loader/loader')

    loader
      .then(messages => {
        for (let message in messages) {
          console.log(yellow(messages[message]))
        }
        console.log(green('Il database è stato popolato.'))
        return process.exit()
      })
      .catch(e => {
        console.error(red(e.message))
        return process.exit()
      })
  })
})
