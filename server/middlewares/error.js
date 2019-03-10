const error = (err, req, res, next) => {
  let message
  switch (err.name) {
    case 'ValidationError':
      for (let field in err.errors) {
        let e = err.errors[field]
        switch (e.properties.type) {
          case 'required':
            message = `Il campo '${e.properties.path}' è obbligatorio.`
            break
          default:
            message = e.message
        }
      }
      break
    case 'MongoError':
      message = 'Si è verificato un errore nel database.'
      break
    default:
      message = err.message
  }
  res.status(err.code || 500).send({
    messages: [message]
  })
  next(err)
}

module.exports = () => error
