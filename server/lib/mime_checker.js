const { Transform } = require('stream')
const { promisify } = require('util')
const { Magic, MAGIC_MIME_TYPE } = require('mmmagic')

class MimeChecker extends Transform {
  constructor (options) {
    super()
    this.data = []
    this.mimeFound = false
    this.options = options
  }

  _transform (chunk, encoding, done) {
    if (this.mimeFound) {
      this.push(chunk)
      return done()
    }

    this.data.push(chunk)
    if (this.data.length < 10) {
      return done()
    } else if (this.data.length === 10) {
      // this.pause()
      const buffered = Buffer.concat(this.data)
      const checker = new Magic(MAGIC_MIME_TYPE)
      checker.detect = promisify(checker.detect)
      checker.detect(buffered)
        .then(mime => {
          if (!this.checkFileFormat(mime)) {
            return this.emit('error', new Error('Il formato del file non è consentito.'))
          }
          this.data.map(this.push.bind(this))
          this.mimeFound = true
          return done()
        })
        .catch(e => {
          this.emit('error', e)
        })
    }
  }

  checkFileFormat (mime) {
    return this.options.mimetypes.includes(mime)
  }
}

module.exports = MimeChecker
