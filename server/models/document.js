const mongoose = require('mongoose')
const validator = require('validator')

var DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: false
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un ID valido.'
    // },
    ref: 'document_type'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    minlength: 1,
    unique: false,
    trim: true,
    ref: 'User'
  },
  faculty: {
    type: String,
    unique: false,
    required: false,
    trim: true,
    ref: 'Faculty'
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: false,
    ref: 'Subject'
  },
  grade: {
    type: Number,
    required: false,
    unique: false,
    trim: true,
    ref: 'Grade'
  },
  section: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    // validate: {
    //   validator: validator.isAlpha,
    //   message: "{VALUE} non è una sezione valida."
    // },
    ref: 'Section'
  },
  visibility: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    // validate: {
    //   validator: validator.isAlpha,
    //   message: '{VALUE} non è un criterio di visibilità valido.'
    // },
    ref: 'document_visibility'
  },
  description: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    trim: false
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
    unique: false,
    minlength: 1,
    trim: true
  }
})

DocumentSchema.statics.searchDocuments = function (search, user) {
  var Document = this

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
    .then((documents) => {
      for (let i = 0; i < documents.length; i++) {
        if (String(documents[i].author._id) === String(user._id) || user.privileges._id === 'admin') {
          documents[i].own = true
        }
      }
      return Promise.resolve(documents)
    })
    .catch((e) => {
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
