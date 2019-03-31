const fs = require('fs')
const client = require('./minio')
const MimeChecker = require('./mime_checker')
const mimetypes = require('../config/mimetypes/mimetypes')

class Uploader {
  constructor (req, res) {
    this.file = req.file
    this.res = res
    this.checker = new MimeChecker({
      mimetypes
    })
  }

  async upload (bucket, filename) {
    const read = fs.createReadStream(this.file.path)

    this.checker.on('error', e => {
      return this.res.status(415).json({
        messages: [e.message]
      })
    })

    try {
      return client.putObject(bucket, filename, read.pipe(this.checker), {
        'Content-type': this.file.mimetype
      })
    } catch (e) {
      throw new Error('Impossibile caricare il file.')
    }
  }
}

module.exports = (req, res) => new Uploader(req, res)
