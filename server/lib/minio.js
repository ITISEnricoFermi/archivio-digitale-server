const Minio = require('minio')

module.exports = new Minio.Client({
  endPoint: process.env.MINIO_HOST || 'localhost',
  port: Number(process.env.MINIO_PORT) || 3013,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'accesskey',
  secretKey: process.env.MINIO_SECRET_KEY || 'secretkey'
})
