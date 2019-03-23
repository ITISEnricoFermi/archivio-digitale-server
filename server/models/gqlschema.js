const { gql } = require('apollo-server-express')

module.exports = gql`
  type User {
    firstname: String
    lastname: String
    email: String
    password: String
    accesses: [Acces]
    privileges: String
    state: String
  }

  type Acces {
    id: String
  }

  type Query {
    user(name: String): User
  }
`