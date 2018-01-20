const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');

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

// Settings functions
const {
  updateInformations
} = require("./functions/settings");

// Routes
const admin = require("./routes/admin");
const upload = require("./routes/upload");
const search = require("./routes/search");
const api = require("./routes/api");
const documents = require("./routes/documents");
const signup = require("./routes/signup");
const login = require("./routes/login");

var app = express();

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

hbs.registerPartials(__dirname + "/views/partials/");


// DIRECTORY DOCUMENTI PRIVATA
app.get("/documents/*", authenticate, (req, res) => {
  console.log(req.params.file);
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");


app.get("/", authenticate, (req, res) => {
  res.render("index", {
    pageTitle: "Archivio Digitale - ITIS Enrico Fermi"
  });
});


app.get("/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.post("/settings/updateInformations", authenticate, (req, res) => {

  var body = _.pick(req.body, ["subject", "oldPassword", "newPassword", "token"]);
  var token = body.token;

  User.findByToken(token).then((user) => {
    // if (!user) {
    //   return Promise.reject();
    // } else {
    //
    //   // updateInformations(user, body.oldPassword, body.newPassword).then((newuser) => {
    //   //   res.status(200).send(newUser);
    //   // }).catch((eee) => {
    //   //   res.status(400).send(eee);
    //   // });
    //
    //
    //
    //
    // }
    user.firstname = "Sara";
    user.save();

    next();

  }).catch((e) => {
    res.status(401).send(e);
  });
});


app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});