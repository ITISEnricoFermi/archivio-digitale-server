require('./config/env/env')
require('./config/mongoose')

const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socketIO = require('socket.io')
const helmet = require('helmet')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

// VARS
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'
const {version, author} = require('../package.json')
process.env.root = __dirname
// const whitelist = process.env.CORS_WHITELIST || ['http://localhost:8080']

// Middleware
const error = require('./middleware/error')

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
} else {
  app.use(history())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(passport.initialize())

// app.use(cors({
//   origin (origin, callback) {
//     console.log(origin)
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true,
//   method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// }))

app.use(cors({
  origin: true,
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
app.use(express.static(path.join(__dirname, '/client')))

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

app.get('/', (req, res) => {
  res.status(200).json({
    title: 'Archivio Digitale - ITIS Enrico Fermi',
    version,
    author,
    legal: 'This project is licensed under the MIT License.'
  })
})

app.use(error())

server.listen(port, () => console.log(`Server started on port ${port}.`))
