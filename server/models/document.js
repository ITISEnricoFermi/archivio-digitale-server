const mongoose = require('mongoose')

const {
  ObjectId
} = mongoose.Schema

let DocumentSchema = new mongoose.Schema({
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
    ref: 'document_type'
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
    ref: 'Faculty'
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    ref: 'Subject'
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
    ref: 'document_visibility'
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
  if (!user) {
    document.editable = false
  } else {
    const isAdmin = user.privileges._id === 'admin'
    const isAuthor = user._id === document.author._id
    document.editable = !!(isAdmin || isAuthor)
  }
  return document
}

DocumentSchema.statics.isReadable = function (document, user) {
  if (!user) {
    const isPublic = document.visibility._id === 'pubblico'
    return isPublic
  } else {
    const isAdmin = user.privileges._id === 'admin'
    const isAuthor = user._id === document.author._id
    return !!(isAdmin || isAuthor)
  }
}

DocumentSchema.statics.getVisibility = function (user, visibility) {
  let query = []
  if (!user) {
    query.push({
      visibility: 'pubblico'
    })
    return query
  }
  switch (user.privileges._id) {
    case 'user':
      query.push({
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
      break
    case 'admin':
      if (visibility) {
        query.push({
          visibility
        })
      }
      break
    default:
      query.push({
        visibility: 'pubblico'
      })
      break
  }
  return query
}

DocumentSchema.statics.searchDocuments = function (search, user) {
  const Document = this

  const query = Document.getVisibility(user, search.visibility)

  if (search.fulltext) {
    query.push({
      $text: {
        $search: search.fulltext
      }
    })
  }

  if (search.type) {
    query.push({
      type: search.type
    })
  }

  if (search.faculty) {
    query.push({
      faculty: search.faculty
    })
  }

  if (search.subject) {
    query.push({
      subject: search.subject
    })
  }

  if (search.grade) {
    query.push({
      grade: search.grade
    })
  }

  if (search.section) {
    query.push({
      section: search.section
    })
  }

  return Document.find({
    $and: query
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

DocumentSchema.statics.getRecentDocuments = async function (page, number, type, user) {
  const Document = this

  const visibility = Document.getVisibility(user, false)
  const query = {}

  if (visibility.length) {
    query.$and = visibility
  }

  if (type) {
    query.type = type
  }

  const documents = await Document.find(query)
    .skip(Number(page) > 0 ? ((Number(page) - 1) * Number(number)) : 0)
    .limit(Number(number))
    .sort({
      _id: -1
    })
    .lean()

  documents.map(document => Document.isEditable(document, user))

  return documents
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

const Document = mongoose.model('Document', DocumentSchema)

module.exports = {
  Document
}
