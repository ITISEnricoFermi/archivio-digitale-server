const os = require('os')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, os.tmpdir())
  },
  filename (req, file, cb) {
    const hash = crypto.createHash('SHA1')
    const date = new Date()
    hash.update(date.toISOString())
    cb(null, hash.digest('hex') + path.extname(file.originalname))
  }
})

module.exports = multer({
  storage
}).single('file')
