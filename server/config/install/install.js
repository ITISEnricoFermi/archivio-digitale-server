const rl = require('readline-sync')
const util = require('util')
const figlet = util.promisify(require('figlet'))
const chalk = require('chalk')
const checkAnswer = require('./utils/checkAnswer')

const install = async () => {
  const data = await figlet('Archivio Digitale')
  console.log(chalk.rgb(26, 141, 76)(data))

  const envAnswer = rl.question(chalk.bold.rgb(10, 100, 200)('Desideri modificare le impostazioni?', chalk.yellow('(yes) ')))
  if (checkAnswer(envAnswer)) {
    const env = require('./lib/env')
    await env()
  }

  const databaseAnswer = rl.question(chalk.bold.rgb(10, 100, 200)('Desideri popolare il database?', chalk.yellow('(yes) ')))
  if (checkAnswer(databaseAnswer)) {
    const database = require('./lib/database')
    await database()

    const adminAnswer = rl.question(chalk.bold.rgb(10, 100, 200)('Desideri creare un utente admin?', chalk.yellow('(yes) ')))

    if (checkAnswer(adminAnswer)) {
      const admin = require('./lib/admin')
      await admin()
    }
  }

  const clientAnswer = rl.question(chalk.bold.rgb(10, 100, 200)('Desideri installare il client web?', chalk.yellow('(yes) ')))

  if (checkAnswer(clientAnswer)) {
    const client = require('./lib/client')
    await client()
  }
}

install()
  .then(() => {
    console.log(chalk.yellow('\nL\'Archivio Digitale è stato installato correttamente.'))
    return process.exit(0)
  })
  .catch(e => {
    console.log(e)
    return console.log(chalk.red('Qualcosa è andato storto.'))
  })
