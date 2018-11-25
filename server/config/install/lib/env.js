const rl = require('readline-sync')
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')
const fs = require('fs')

module.exports = async () => {
  const env = path.join(__dirname, '..', '..', 'env')
  const example = path.join(env, 'env.example.json')
  const config = path.join(env, 'env.json')

  let origin
  if (fs.existsSync(config)) {
    origin = require(config)
  } else {
    origin = require(example)
  }

  const { development, production } = origin

  console.log(chalk.magenta('\nImpostazioni per development (se si inseriscono più valori separare con spazi).'))
  Object.keys(development).map((key) => {
    const value = rl.question(chalk.bold.rgb(10, 100, 200)(key, chalk.yellow(`(${development[key]}) `)))
    if (value === '') return value

    if (Array.isArray(production[key])) {
      development[key] = value.split(' ')
    } else if (!isNaN(Number(value))) {
      development[key] = Number(value)
    } else {
      development[key] = value
    }
  })
  console.log(chalk.magenta('\nImpostazioni per production (se si inseriscono più valori separare con spazi).'))
  Object.keys(production).map((key) => {
    const value = rl.question(chalk.bold.rgb(10, 100, 200)(key, chalk.yellow(`(${production[key]}) `)))
    if (value === '') return value

    if (Array.isArray(production[key])) {
      production[key] = value.split(' ')
    } else if (!isNaN(Number(value))) {
      production[key] = Number(value)
    } else {
      production[key] = value
    }
  })

  try {
    // console.log('\n')
    const spinner = ora('\nSalvando le impostazioni.').start()
    fs.writeFileSync(config, JSON.stringify({ development, production }, undefined, 2))
    spinner.succeed(chalk.green('Impostazioni aggiornate.\n'))
  } catch (e) {
    console.log('Impossibile salvare le impostazioni.')
  }
}
