const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require("lodash");

// Middleware
const {
  authenticate
} = require("./../middleware/authenticate");

// Models
const {
  Document
} = require("./../models/document");

const {
  DocumentType
} = require("./../models/document_type");

const {
  Faculty
} = require("./../models/faculty");

const {
  DocumentVisibility
} = require("./../models/document_visibility");

const {
  Section
} = require("./../models/section");

const {
  Subject
} = require("./../models/subject");

const {
  Privilege
} = require("./../models/privilege");

const {
  Class
} = require("./../models/class");

const {
  DocumentCollection
} = require("./../models/document_collection");

const {
  CollectionPermission
} = require("./../models/collection_permission");

const {
  User
} = require("./../models/user");

router.get("/getDocuments", (req, res) => {
  Document.getDocuments()
    .then((documents) => {
      res.status(200).send(documents);
    }).catch((e) => {
      res.status(401).send(e);
    });
});

router.get("/getFaculties", authenticate, (req, res) => {
  Faculty.getFaculties()
    .then((faculties) => {
      res.status(200).send(faculties);
    }).catch((e) => {
      res.status(401).send(e);
    });
});

router.get("/getSubjects", authenticate, (req, res) => {
  Subject.getSubjects()
    .then((subjects) => {
      res.status(200).send(subjects);
    }).catch((e) => {
      res.status(401).send(e);
    });
});

router.get("/getDocumentTypes", (req, res) => {
  DocumentType.getDocumentTypes()
    .then((documentTypes) => {
      res.status(200).send(documentTypes);
    }).catch((e) => {
      res.status(401).send(e);
    });
});

router.get("/getSubjectsByFaculty", (req, res) => {
  Faculty.getSubjectsByFaculty(req.body._id)
    .then((subjects) => {
      res.status(200).send(subjects);
    }).catch((e) => {
      res.status(401).send(e);
    });
});

router.get("/getDocumentVisibilityList", (req, res) => {
  DocumentVisibility.getDocumentVisibility()
    .then((visibilities) => {
      res.status(200).send(visibilities);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/getSections", (req, res) => {
  Section.getSections()
    .then((sections) => {
      res.status(200).send(sections);
    }).catch((e) => {
      res.status(400).send(e)
    });
});

router.get("/getPrivileges", (req, res) => {
  Privilege.getPrivileges()
    .then((privileges) => {
      res.status(200).send(privileges);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/getClasses", (req, res) => {
  Class.getClasses()
    .then((classes) => {
      res.status(200).send(classes);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/getCollections", (req, res) => {
  DocumentCollection.getCollections()
    .then((collections) => {
      res.status(200).send(collections);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
})

router.get("/getCollectionsPermissions", (req, res) => {
  CollectionPermission.getPermissions()
    .then((permissions) => {
      res.status(200).send(permissions);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
})

router.get("/getUsers", authenticate, (req, res) => {
  User.getUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
})

module.exports = router;