const path = require('path')

const {
  Document
} = require('../models/document')

const getDocument = async (req, res, next) => {
  const url = req.url
  const id = path.basename(url, path.extname(url))
  const document = await Document.findById(id)

  console.log(document)

  if (!document) {
    return res.status(404).json({
      messages: ['Il documento non esiste.']
    })
  }

  if (!Document.isReadable(document, req.user)) {
    return res.status(401).send({
      messages: ['Non si detengono i privilegi necessari.']
    })
  }

  next()
}

module.exports = {
  getDocument
}
