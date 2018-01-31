const {
  ObjectID
} = require("mongodb");

const {
  mongoose
} = require("./mongoose");

// Models
const {
  Document
} = require("./../models/document");

const {
  Faculty
} = require("./../models/faculty");

const {
  Subject
} = require("./../models/subject");

const {
  DocumentType
} = require("./../models/document_type");

const {
  Class
} = require("./../models/class");

const {
  Section
} = require("./../models/section");

const {
  Privilege
} = require("./../models/privilege");

const {
  DocumentVisibility
} = require("./../models/document_visibility");

const {
  User
} = require("./../models/user");

var facultyArray = [{
  _id: "comune",
  faculty: "Comune",
  subjects: ["italiano", "storia", "inglese", "matematica", "ed", "irc"]
}, {
  _id: "biennio",
  faculty: "Biennio",
  subjects: ["phy", "chm", "ttrg", "it", "sta", "sci", "bio", "diritto", "geo"]
}, {
  _id: "infTlc",
  faculty: "Informatica e Telecomunicazioni",
  subjects: ["sysnet", "tpsit", "gpo", "informatica", "tlc"]
}, {
  _id: "eleAuto",
  faculty: "Elettronica, Elettrotecnica e Automazione",
  subjects: ["tpsee", "elettronica", "sysaut"]
}, {
  _id: "mecEne",
  faculty: "Meccanica e meccatronica ed Energia",
  subjects: ["meccanica", "sysandaut", "tmpp", "iedp"]
}];

var subjectArray = [{ // Comune
  _id: "italiano",
  subject: "Lingua e letteratura italiana"
}, {
  _id: "storia",
  subject: "Storia"
}, {
  _id: "inglese",
  subject: "Inglese"
}, {
  _id: "matematica",
  subject: "Matematica"
}, {
  _id: "ed",
  subject: "Scienze motorie e sportive"
}, {
  _id: "irc",
  subject: "Religione cattolica o Attività alternative"
}, { // Biennio
  _id: "phy",
  subject: "Fisica"
}, {
  _id: "chm",
  subject: "Chimica"
}, {
  _id: "ttrg",
  subject: "Tecnologie e tecniche di rappresentazione grafica"
}, {
  _id: "it",
  subject: "Tecnologie informatiche"
}, {
  _id: "sta",
  subject: "Scienze e tecnologie applicate"
}, {
  _id: "sci",
  subject: "Scienze della terra"
}, {
  _id: "bio",
  subject: "Biologia"
}, {
  _id: "diritto",
  subject: "Diritto ed economia"
}, {
  _id: "geo",
  subject: "Geografia"
}, { // Informatica e Telecomunicazioni
  _id: "sysnet",
  subject: "Sistemi e reti"
}, {
  _id: "tpsit",
  subject: "Tecnologie e progettazione di sistemi informatici e di telecomunicazioni"
}, {
  _id: "gpo",
  subject: "Gestione progetto, organizzazione d’impresa"
}, {
  _id: "informatica",
  subject: "Informatica"
}, {
  _id: "tlc",
  subject: "Telecomunicazioni"
}, { // Elettronica ed Automazione
  _id: "tpsee",
  subject: "Tecnologie e progettazione di sistemi elettrici ed elettronici"
}, {
  _id: "elettronica",
  subject: "Elettrotecnica ed Elettronica"
}, {
  _id: "sysaut",
  subject: "Sistemi automatici"
}, { // Energia
  _id: "meccanica",
  subject: "Meccanica, macchine ed energia"
}, {
  _id: "sysandaut",
  subject: "Sistemi ed automazione"
}, {
  _id: "tmpp",
  subject: "Tecnologie meccaniche di processo e prodotto"
}, {
  _id: "iedp",
  subject: "Impianti energetici disegno e progettazione"
}];

var documentTypeArray = [{
  _id: "videoLezione",
  type: "Video lezione"
}, {
  _id: "audioLezione",
  type: "Audio lezione"
}, {
  _id: "appunti",
  type: "Appunti"
}, {
  _id: "progettiStudenti",
  type: "Progetti studenti"
}, {
  _id: "programmazioni",
  type: "Programmazioni"
}, {
  _id: "proveComuni",
  type: "Prove comuni"
}, {
  _id: "altro",
  type: "Altro"
}];

var sectionArray = [{
  _id: "a",
  section: "A"
}, {
  _id: "b",
  section: "B"
}, {
  _id: "c",
  section: "C"
}, {
  _id: "d",
  section: "D"
}, {
  _id: "e",
  section: "E"
}, {
  _id: "f",
  section: "F"
}, {
  _id: "g",
  section: "G"
}, {
  _id: "h",
  section: "H"
}, {
  _id: "i",
  section: "I"
}, {
  _id: "l",
  section: "L"
}, {
  _id: "m",
  section: "M"
}, {
  _id: "n",
  section: "N"
}, {
  _id: "o",
  section: "O"
}, {
  _id: "p",
  section: "P"
}, {
  _id: "q",
  section: "Q"
}];

var documentVisibilityArray = [{
  _id: "pubblico",
  visibility: "Pubblico"
}, {
  _id: "areariservata",
  visibility: "Area riservata"
}, {
  _id: "materia",
  visibility: "Per materia"
}];

var privilegeArray = [{
  _id: "user",
  privilege: "Utente"
}, {
  _id: "admin",
  privilege: "Admin"
}];

var classArray = [{
  _id: 1,
  class: 1
}, {
  _id: 2,
  class: 2
}, {
  _id: 3,
  class: 3
}, {
  _id: 4,
  class: 4
}, {
  _id: 5,
  class: 5
}];

var userArray = [{
  "privileges": "admin",
  "state": "active",
  "firstname": "Alan",
  "lastname": "Turing",
  "email": "alan.turing@test.com",
  "password": "alanturing",
  "img": "../images/elements/alan.jpg"
}];

userArray.forEach((user) => {
  var userToInsert = new User(user);

  userToInsert.save()
    .then((user) => {
      return user;;
    }).catch((e) => {
      return e;
    });

});

classArray.forEach((classObj) => {
  var classToInsert = new Class(classObj);

  classToInsert.save()
    .then((classObj) => {
      return classObj;;
    }).catch((e) => {
      return e;
    });

});

documentVisibilityArray.forEach((visibility) => {
  var documentVisibilityToInsert = new DocumentVisibility(visibility);

  documentVisibilityToInsert.save()
    .then((visibility) => {
      return visibility;
    }).catch((e) => {
      return e;
    });

});

privilegeArray.forEach((privilege) => {
  var privilegeToInsert = new Privilege(privilege);

  privilegeToInsert.save()
    .then((privilege) => {
      return privilege;
    }).catch((e) => {
      return e;
    });

});

sectionArray.forEach((section) => {
  var sectionToInsert = new Section(section);

  sectionToInsert.save()
    .then((section) => {
      return section;
    }).catch((e) => {
      return e;
    });

});

facultyArray.forEach((faculty) => {
  var facultyToInsert = new Faculty(faculty);

  facultyToInsert.save()
    .then((faculty) => {
      return faculty;
    });

});

subjectArray.forEach((subject) => {
  var subjectToInsert = new Subject(subject);

  subjectToInsert.save()
    .then((subject) => {
      return subject;
    });

});

documentTypeArray.forEach((documentType) => {
  var documentTypeToInsert = new DocumentType(documentType);

  documentTypeToInsert.save()
    .then((documentType) => {
      return documentType;
    }).catch((e) => {
      return e;
    });

});