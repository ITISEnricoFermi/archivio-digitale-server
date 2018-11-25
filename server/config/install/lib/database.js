const chalk = require('chalk')
const loader = require('../../loader/loader')
const ora = require('ora')

module.exports = async () => {
  const spinner = ora('Popolando il database.').start()
  try {
    const messages = await loader
    for (let message in messages) {
      spinner.succeed(chalk.green(messages[message]))
    }
    // console.log(chalk.yellow('\nIl database è stato popolato.\n'))
  } catch (e) {
    spinner.fail(chalk.red(e.message))
    return process.exit(1)
  }
}
