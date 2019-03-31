const Minio = require('minio')

module.exports = new Minio.Client({
  endPoint: 'localhost',
  port: 3013,
  useSSL: false,
  accessKey: 'accesskey',
  secretKey: 'secretkey'
})
