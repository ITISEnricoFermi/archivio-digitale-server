const readline = require('readline')
const shell = require('shelljs')
const figlet = require('figlet')
const chalk = require('chalk')

const ora = require('ora')

const loader = require('../loader/loader')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

figlet('Archivio Digitale', (err, data) => {
  // Heading
  if (err) return console.log(chalk.red('Qualcosa è andato storto.'))
  console.log(chalk.rgb(26, 141, 76)(data))

  rl.question(chalk.bold.rgb(10, 100, 200)('Desideri popolare il database?', chalk.yellow('(yes) ')), (answer) => {
    answer = answer || 'yes'

    if (answer === 'yes') {
      const spinner = ora('Popolando il database.').start()

      loader.then(messages => {
        for (let message in messages) {
          spinner.succeed(chalk.green(messages[message]))
        }
        console.log(chalk.yellow('\nIl database è stato popolato.\n'))

        rl.question(chalk.bold.rgb(10, 100, 200)('Desideri creare un utente admin?', chalk.yellow('(yes) ')), (answer) => {
          answer = answer || 'yes'

          spinner.text = 'Creando utente admin.'
          spinner.start()

          const {
            loadUsers
          } = require('./loaders/loaders/user.loader')

          loadUsers.then(message => {
            spinner.succeed(chalk.green(message))
            const users = require('../seed/seeds/user.json')
            console.log(`\n${JSON.stringify(users, undefined, 2)}\n`)

            rl.question(chalk.bold.rgb(10, 100, 200)('Desideri installare il client web?', chalk.yellow('(yes) ')), (answer) => {
              answer = answer || 'yes'

              if (answer === 'yes') {
                spinner.text = 'Installando il client web.'
                spinner.start()
                shell.exec('npm run client', {silent: true})
                spinner.succeed(chalk.green('Client web installato con successo con successo!'))
                console.log(chalk.yellow('\nL\'Archivio Digitale è stato installato correttamente.'))
              }

              rl.close()
              return process.exit(0)
            })
          })
            .catch(e => {
              spinner.fail(chalk.red(e.message))
            })
        })
      })
        .catch(e => {
          spinner.fail(chalk.red(e.message))
          return process.exit(1)
        })
    }
  })
})
