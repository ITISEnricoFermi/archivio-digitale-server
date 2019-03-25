const { gql } = require('apollo-server-express')

module.exports = gql`

  type User {
    id: String
    firstname: String
    lastname: String
    email: String
    password: String
    accesses: [String]
    privileges: String
    state: String
  }

  type Section {
    id: String
    section: String
  }

  type Grade {
    id: Int
    grade: Int
  }

  type Subject {
    id: String
    subject: String
  }

  type Privilege {
    id: String
    privilege: String
  }

  type Faculty {
    id: String
    faculty: String
    subjects: [Subject]
  }

  type DocumentType {
    id: String
    type: String
  }

  type DocumentVisibility {
    id: String
    visibility: String
  }

  type CollectionPermission {
    id: String
    permission: String
  }

  type DocumentCollection {
    documentCollection: String
    author: User
    documents: [Document]
    permissions: CollectionPermission
    authorizations: [User]
  }

  type Document {
    name: String
    type: DocumentType
    author: User
    faculty: Faculty
    subject: Subject
    grade: Grade
    section: Section
    visibility: String
    description: String
    directory: String
    mimetype: String
  }

  type Request {
    userId: String
  }

  type Query {
    user(id: String!): User
    document(id: String!): Document
  }
`
