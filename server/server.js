require('./config/env/env.js')
require('./config/mongoose')

const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socketIO = require('socket.io')
const helmet = require('helmet')
// const history = require('connect-history-api-fallback')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')

// VARS
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'

// Routes
const signup = require('./routes/signup')
const login = require('./routes/login')
const api = require('./routes/api/api')
const logout = require('./routes/logout')
const publicRoute = require('./routes/public')

// INIT
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

if (env === 'development') {
  app.use(morgan('dev'))
}
// else {
//   app.use(history())
// }

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.options('*', cors())

app.use((req, res, next) => {
  req.messages = []
  next()
})

// Routes
app.use('/signup', signup)
app.use('/login', login)
app.use('/logout', logout)
app.use('/public', publicRoute)
app.use('/api', api)

// Public directory
app.use(express.static(path.join(__dirname, '/public')))

// Socket events
io.on('connection', (socket) => {
  socket.on('newDocument', () => {
    io.emit('newDocument')
  })

  socket.on('documentDeleted', () => {
    io.emit('documentDeleted')
  })

  socket.on('documentUpdated', () => {
    io.emit('documentUpdated')
  })

  socket.on('newUser', () => {
    io.emit('newUser')
  })

  socket.on('collectionDeleted', () => {
    io.emit('collectionDeleted')
  })

  socket.on('collectionUpdated', () => {
    io.emit('collectionUpdated')
  })

  socket.on('userUpdated', (user) => {
    io.emit('userUpdated', user)
    // socket.broadcast.emit('userUpdated', user) <===== DA VEDERE
  })

  socket.on('userDeleted', (user) => {
    // io.emit('userDeleted', user)
    socket.broadcast.emit('userDeleted')
  })
})

app.use((err, req, res, next) => {
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
})

server.listen(port, () => console.log(`Server started on port ${port}.`))
