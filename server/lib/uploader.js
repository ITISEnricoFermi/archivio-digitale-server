const fs = require('fs')
const client = require('./minio')
const MimeChecker = require('./mime_checker')

class Uploader {
  constructor (req, res, mimetypes) {
    this.file = req.file
    this.res = res
    this.mimetypes = mimetypes

    // this.checker.on('error', e => {
    //   this.res.status(415).json({
    //     messages: ['Impossibile caricare il file.']
    //   })
    // })
  }

  async upload (bucket, filename, stream) {
    const read = stream

    try {
      return client.putObject(bucket, filename, read.pipe(new MimeChecker({
        mimetypes: this.mimetypes
      })), {
        'Content-type': this.file.mimetype
      })
    } catch (e) {
      throw new Error('Impossibile caricare il file.')
    }
  }
}

module.exports = (req, res, mimetypes) => new Uploader(req, res, mimetypes)
