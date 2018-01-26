require("./db/config/config.js");

const express = require('express');
const http = require('http');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');


const {
  ObjectId
} = require("mongodb");

const {
  mongoose
} = require("./db/mongoose");

// Models
const {
  User
} = require("./models/user");

const {
  Document
} = require("./models/document");

const {
  Faculty
} = require("./models/faculty");

const {
  Subject
} = require("./models/subject");

const {
  Class
} = require("./models/class");

const {
  Section
} = require("./models/section");

const {
  DocumentType
} = require("./models/document_type");

const {
  DocumentVisibility
} = require("./models/document_visibility");

// Middleware
const {
  authenticate,
  authenticateAdmin
} = require("./middleware/authenticate");

// Routes
const admin = require("./routes/admin");
const upload = require("./routes/upload");
const search = require("./routes/search");
const api = require("./routes/api");
const documents = require("./routes/documents");
const signup = require("./routes/signup");
const login = require("./routes/login");
const settings = require("./routes/settings");
const user = require("./routes/user");
const dashboard = require("./routes/dashboard");

var app = express();
var server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/admin", admin);
app.use("/upload", upload);
app.use("/search", search);
app.use("/api", api);
app.use("/documents", documents);
app.use("/signup", signup);
app.use("/login", login);
app.use("/settings", settings);
app.use("/user", user);
app.use("/dashboard", dashboard);

hbs.registerPartials(__dirname + "/views/partials/");

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");


app.get("/", authenticate, (req, res) => {
  res.render("index", {
    pageTitle: "Archivio Digitale - ITIS Enrico Fermi",
    admin: () => {
      if (req.user.privileges === "admin") {
        return true;
      } else {
        return false;
      }
    }
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