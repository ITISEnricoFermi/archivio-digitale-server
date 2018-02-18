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

const {
  DocumentCollection
} = require("./../models/document_collection");

const {
  CollectionPermission
} = require("./../models/collection_permission");


const facultyArray = require("./seeds/faculty");
const privilegeArray = require("./seeds/privilege");
const subjectArray = require("./seeds/subject");
const documentTypeArray = require("./seeds/documentType");
const sectionArray = require("./seeds/section");
const documentVisibilityArray = require("./seeds/DocumentVisibility");
const classArray = require("./seeds/class");
const userArray = require("./seeds/user");
const collectionPermissionArray = require("./seeds/collectionPermission")

userArray.forEach((user) => {
  var userToInsert = new User(user);

  userToInsert.save();
});

classArray.forEach((classObj) => {
  var classToInsert = new Class(classObj);

  classToInsert.save();
});

documentVisibilityArray.forEach((visibility) => {
  var documentVisibilityToInsert = new DocumentVisibility(visibility);

  documentVisibilityToInsert.save();
});

privilegeArray.forEach((privilege) => {
  var privilegeToInsert = new Privilege(privilege);

  privilegeToInsert.save();
});

sectionArray.forEach((section) => {
  var sectionToInsert = new Section(section);

  sectionToInsert.save();
});

facultyArray.forEach((faculty) => {
  var facultyToInsert = new Faculty(faculty);

  facultyToInsert.save();
});

subjectArray.forEach((subject) => {
  var subjectToInsert = new Subject(subject);

  subjectToInsert.save();
});

documentTypeArray.forEach((documentType) => {
  var documentTypeToInsert = new DocumentType(documentType);

  documentTypeToInsert.save();
});

collectionPermissionArray.forEach((permission) => {
  var collectionPermissionToInsert = new CollectionPermission(permission);

  collectionPermissionToInsert.save();
});


console.log("Il database è stato popolato.");