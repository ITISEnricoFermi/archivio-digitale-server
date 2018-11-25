const chalk = require('chalk')
const ora = require('ora')

module.exports = async () => {
  const {
    loadUsers
  } = require('../../loader/loaders/user.loader')

  const spinner = ora({
    spinner: 'moon',
    text: 'Creando utente admin.'
  }).start()

  try {
    const message = await loadUsers
    spinner.succeed(chalk.green(message))
    const users = require('../../seed/seeds/user.json')
    console.log(`\n${JSON.stringify(users, undefined, 2)}\n`)
  } catch (e) {
    spinner.fail(chalk.red(e.message))
  }
}
