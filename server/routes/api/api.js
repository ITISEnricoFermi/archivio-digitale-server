const express = require('express')
const router = express.Router()
const history = require('connect-history-api-fallback')
const env = process.env.NODE_ENV || 'development'

// Versions
const v1 = require('./v1/v1')

router.use('/v1', v1)

if (env === 'production') {
  router.use(history())
}

module.exports = router
