const fs = require('fs')
const client = require('./minio')
const MimeChecker = require('./mime_checker')

class Uploader {
  constructor (req, res, mimetypes) {
    this.file = req.file
    this.res = res
    this.checker = new MimeChecker({
      mimetypes
    })
  }

  async upload (bucket, filename) {
    const read = fs.createReadStream(this.file.path)

    this.checker.on('error', e => {
      this.res.status(415).json({
        messages: ['Impossibile caricare il file.']
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

module.exports = (req, res, mimetypes) => new Uploader(req, res, mimetypes)
