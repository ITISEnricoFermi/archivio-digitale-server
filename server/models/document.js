const mongoose = require('mongoose')

const {
  ObjectId
} = mongoose.Schema

// Models
const {
  DocumentType
} = require('../models/document_type')

const {
  Faculty
} = require('../models/faculty')

const {
  Subject
} = require('../models/subject')

const {
  DocumentVisibility
} = require('../models/document_visibility')

var DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    ref: 'document_type',
    validate: [async (value) => {
      let documentType = await DocumentType.findById(value)
      if (!documentType) {
        return false
      }
    }, '\'{VALUE}\' non è un tipo valido.']
  },
  author: {
    type: ObjectId,
    required: true,
    minlength: 1,
    trim: true,
    ref: 'User'
  },
  faculty: {
    type: String,
    require: true,
    minlength: 1,
    trim: true,
    ref: 'Faculty',
    validate: [async (value) => {
      let faculty = await Faculty.findById(value)
      if (!faculty) {
        return false
      }
    }, '\'{VALUE}\' non è una specializzazione valida.']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    ref: 'Subject',
    validate: [async (value) => {
      let subject = await Subject.findById(value)
      if (!subject) {
        return false
      }
    }, '\'{VALUE}\' non è una materia valida.']
  },
  grade: {
    type: Number,
    trim: true,
    ref: 'Grade'
  },
  section: {
    type: String,
    trim: true,
    ref: 'Section'
  },
  visibility: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    ref: 'document_visibility',
    validate: [async (value) => {
      let documentVisibility = await DocumentVisibility.findById(value)
      if (!documentVisibility) {
        return false
      }
    }, '\'{VALUE}\' non è un criterio di visibilità valido.']
  },
  description: {
    type: String,
    required: true,
    minlength: 1
  },
  directory: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true
  },
  mimetype: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

DocumentSchema.statics.isEditable = function (document, user) {
  const isAdmin = user.privileges._id === 'admin'
  const isAuthor = user._id === document.author._id
  document.editable = !!(isAdmin || isAuthor)
  return document
}

DocumentSchema.statics.searchDocuments = function (search, user) {
  const Document = this

  var andQuery = []

  if (user.privileges === 'user') {
    andQuery.push({
      $or: [{
        visibility: 'pubblico'
      }, {
        visibility: 'areariservata'
      }, {
        $and: [{
          visibility: 'materia'
        }, {
          subject: {
            $in: user.accesses
          }
        }]
      }]
    })
  } else {
    andQuery.push({})
  }

  if (search.fulltext) {
    andQuery.push({
      $text: {
        $search: search.fulltext
      }
    })
  }

  if (search.type) {
    andQuery.push({
      type: search.type
    })
  }

  if (search.faculty) {
    andQuery.push({
      faculty: search.faculty
    })
  }

  if (search.subject) {
    andQuery.push({
      subject: search.subject
    })
  }

  if (search.grade) {
    andQuery.push({
      grade: search.grade
    })
  }

  if (search.section) {
    andQuery.push({
      section: search.section
    })
  }

  if (search.visibility) {
    andQuery.push({
      visibility: search.visibility
    })
  }

  return Document.find({
    $and: andQuery
  }, {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  })
    .limit(10).lean()
    .catch(e => {
      return Promise.reject(e)
    })
}

DocumentSchema.statics.searchPublicDocuments = function (search, user) {
  let Document = this

  var andQuery = []

  if (search.fulltext) {
    andQuery.push({
      $text: {
        $search: search.fulltext
      }
    })
  }

  if (search.type) {
    andQuery.push({
      type: search.type
    })
  }

  if (search.faculty) {
    andQuery.push({
      faculty: search.faculty
    })
  }

  if (search.subject) {
    andQuery.push({
      subject: search.subject
    })
  }

  if (search.grade) {
    andQuery.push({
      grade: search.grade
    })
  }

  if (search.section) {
    andQuery.push({
      section: search.section
    })
  }

  if (andQuery.length === 0) {
    return Promise.reject(new Error('Nessuna query di ricerca.'))
  }

  andQuery.push({
    visibility: 'pubblico'
  })

  return Document.find({
    $and: andQuery
  }, {
    score: {
      $meta: 'textScore'
    }
  }).sort({
    score: {
      $meta: 'textScore'
    }
  })
    .limit(10)
    .then((documents) => {
      return Promise.resolve(documents)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

DocumentSchema.pre('find', function (next) {
  this.populate('author', 'firstname lastname')
    .populate('type', 'type')
    .populate({
      path: 'faculty',
      select: 'faculty'
    })
    .populate({
      path: 'subject',
      select: 'subject'
    })
    .populate({
      path: 'grade',
      select: 'grade'
    })
    .populate({
      path: 'section',
      select: 'section'
    })
    .populate('visibility', 'visibility')

  next()
})

DocumentSchema.pre('findOne', function (next) {
  this.populate('author', 'firstname lastname')
    .populate('type', 'type')
    .populate({
      path: 'faculty',
      select: 'faculty'
    })
    .populate({
      path: 'subject',
      select: 'subject'
    })
    .populate({
      path: 'grade',
      select: 'grade'
    })
    .populate({
      path: 'section',
      select: 'section'
    })
    .populate('visibility', 'visibility')

  next()
})

// DocumentSchema.pre('init', function(data) {
//
//   // data.collection = {
//   //   mamma: "ciao"
//   // };
//
//   return DocumentCollection.findById("5a930c3d582986318f151db0")
//     .then((collection) => {
//       data.collection = collection;
//     })
//     .catch((e) => {
//       console.log(e);
//     });
//
// });

DocumentSchema.index({
  name: 'text',
  description: 'text'
})

var Document = mongoose.model('Document', DocumentSchema)

module.exports = {
  Document
}
