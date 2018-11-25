const shell = require('shelljs')
const chalk = require('chalk')
const ora = require('ora')

module.exports = async () => {
  const spinner = ora('Installando il client web.').start()
  shell.exec('npm run client', {silent: true})
  spinner.succeed(chalk.green('Client web installato con successo con successo!'))
}
