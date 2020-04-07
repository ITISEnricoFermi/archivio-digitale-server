module.exports = () => (err, req, res, next) => {
  let message
  let code

  switch (err.name) {
    case 'ValidationError':
      for (const field in err.errors) {
        const e = err.errors[field]
        message = e.message
        code = 400
      }
      break
    case 'MongoError':
      message = 'Si è verificato un errore nel database.'
      break
    default:
      message = err.message
  }

  res.status(code || 500).send({
    messages: [message]
  })
  next(err)
}
