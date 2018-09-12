const error = (err, req, res, next) => {
  let message
  switch (err.name) {
    case 'ValidationError':

      for (let field in err.errors) {
        message = err.errors[field].message
      }
      break
    default:
      message = err.message
  }
  res.status(500).send({
    messages: [message]
  })
  next(err)
}

module.exports = () => error
