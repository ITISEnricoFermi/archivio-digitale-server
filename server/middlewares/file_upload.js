const multer = require('multer')
const path = require('path')

const {
  asyncMiddleware
} = require('./async')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'public', 'documents'))
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + path.extname(file.originalname))
  }
})

const fileFilter = asyncMiddleware(async (req, file, cb) => {
  // req.body.document = _.pick(req.body, ['name', 'type', 'faculty', 'subject', 'grade', 'section', 'visibility', 'description'])

  const mimeypes = ['audio/aac', 'video/x-msvideo', 'text/csv', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip', 'image/gif', 'image/x-icon', 'image/jpeg', 'audio/midi',
    'video/mpeg', 'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.text',
    'audio/ogg', 'video/ogg', 'application/ogg', 'image/png', 'application/pdf',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-rar-compressed', 'application/rtf', 'application/x-tar', 'image/tiff', 'application/vnd.visio',
    'audio/x-wav', 'audio/webm', 'video/webm', 'image/webp', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/x-7z-compressed', 'text/plain'
  ]

  if (mimeypes.indexOf(file.mimetype) === -1 && !(new RegExp('^' + 'video/', 'i')).test(file.mimetype)) {
    cb(new Error('Il formato del file non è valido.'), false) // Il file usa un formato non ammesso
  } else {
    cb(null, true) // Il file usa un formato permesso
  }
})

const limits = {
  fileSize: 1024 * 1024 * 100 // 100 MB
}

module.exports = multer({
  storage,
  limits,
  fileFilter
}).single('file')
