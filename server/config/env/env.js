const env = process.env.NODE_ENV || 'development'

// if (env === 'development') {
const config = require('./env.json')
const envConfig = config[env]

Object.keys(envConfig).forEach((key) => {
  process.env[key] = envConfig[key]
})
// }
