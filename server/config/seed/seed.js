const { yellow, green, red } = require('colors')

const loader = require('../loader/loader')

loader.then(messages => {
  for (let message in messages) {
    console.log(yellow(messages[message]))
  }
  console.log(green('Il database è stato popolato.'))
  return process.exit()
})
  .catch(e => {
    console.log(red(e.message))
    return process.exit(1)
  })
