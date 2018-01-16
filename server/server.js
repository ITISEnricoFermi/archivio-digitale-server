const express = require('express');
const fileUpload = require('express-fileupload');
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
  authenticate
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

var app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload({
  limits: {
    fileSize: 1024 * 1024 * 100
  },
  safeFileNames: true
}));

// Routes
app.use("/admin", admin);
app.use("/upload", upload);
app.use("/search", search);
app.use("/api", api);
app.use("/documents", documents);

hbs.registerPartials(__dirname + "/views/partials/");


app.get("/documents/*", authenticate, (req, res) => {
  console.log(req.params.file);
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");

app.get("/", authenticate, (req, res) => {
  res.render("index", {
    pageTitle: "Archivio Digitale - ITIS Enrico Fermi",
    faculties: Faculty.getFaculties()
  });
});



app.post("/signup", (req, res) => {

  var body = _.pick(req.body, ["firstname", "lastname", "email", "password"]);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header("x-auth", token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.post("/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  console.log(body);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.cookie("token", token)
        .header("x-auth", token).send(JSON.stringify({
          token
        }));
    });
  }).catch((e) => {
    res.status(400).send(e);
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


app.post("/api/getDocuments", (req, res) => {
  Document.getDocuments().then((documents) => {
    res.status(200).send(documents);
  }).catch((e) => {
    res.status(401).send(e);
  });
});

app.post("/api/createDocument", (req, res) => {

  var body = _.pick(req.body, ["name", "type", "author", "faculty", "subject", "class", "section", "description", "directory", "visibility"]);

  var document = new Document(body);

  document.save().then((document) => {
    res.status(200).send(document);
  }).catch((e) => {
    res.status(401).send(e);
  });

});

app.post("/api/getDocument/", (req, res) => {

  Document.findDocumentById(req.body._id).then((document) => {
    res.status(200).send(document);
  }).catch((e) => {
    res.status(401).send(e);
  });

});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});