const { Transform } = require('stream')
const { promisify } = require('util')
const { Magic, MAGIC_MIME_TYPE } = require('mmmagic')

class MimeChecker extends Transform {
  constructor (options) {
    super()
    this.data = []
    this.mimeFound = false
    this.options = options
    // this.setMaxListeners(11)
  }

  _transform (chunk, encoding, done) {
    if (this.mimeFound) {
      this.push(chunk)
      return done()
    }

    this.data.push(chunk)

    const buffered = Buffer.concat(this.data)
    const checker = new Magic(MAGIC_MIME_TYPE)
    checker.detect = promisify(checker.detect)

    return checker.detect(buffered)
      .then(mime => {
        if (!this.checkFileFormat(mime)) {
          throw new Error('Il formato del file non è consentito.')
        } else {
          this.data.map(this.push.bind(this))
          this.mimeFound = true
        }
      })
      .catch(e => {
        this.emit('error', e)
      })
      .finally(() => {
        return done()
      })
  }

  checkFileFormat (mime) {
    return this.options.mimetypes.includes(mime)
  }
}

module.exports = MimeChecker
