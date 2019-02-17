const env = process.env.NODE_ENV || 'development'

if (!process.env.DOCKER) {
  const config = require('./env.json')
  const envConfig = config[env]

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key]
  })
} else {
  process.env.CORS_WHITELIST = ['*']
}
