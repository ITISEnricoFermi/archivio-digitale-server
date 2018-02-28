require("./db/config/config.js");

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const _ = require("lodash");
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');

const {
  mongoose
} = require("./db/mongoose");

// Models
const {
  User
} = require("./models/user");

// Middleware
const {
  authenticate
} = require("./middleware/authenticate");

// Routes
const admin = require("./routes/admin");
const documents = require("./routes/documents");
const collections = require("./routes/collections");
const api = require("./routes/api");
const signup = require("./routes/signup");
const login = require("./routes/login");
const users = require("./routes/users");

var app = express();
var server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/admin", admin);
app.use("/documents", documents);
app.use("/collections", collections);
app.use("/api", api);
app.use("/signup", signup);
app.use("/login", login);
app.use("/users", users);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {

  socket.on("newDocument", () => {
    io.emit("newDocument");
  });

  socket.on("documentDeleted", () => {
    io.emit("documentDeleted");
  });

  socket.on("documentUpdated", () => {
    io.emit("documentUpdated");
  });

  socket.on("newUser", () => {
    io.emit("newUser");
  });

});

app.get("/logout", authenticate, (req, res) => {

  User.findById((req.user._id))
    .then((user) => {
      return user.removeToken(req.token);
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      res.status(400).send(e);
    });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});