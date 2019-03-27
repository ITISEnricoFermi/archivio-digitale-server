const express = require('express')
const router = express.Router()
const { ApolloServer } = require('apollo-server-express')

// REST
const v1 = require('./v1/v1')

router.use('/v1', v1)

// GraphQL
const apollo = new ApolloServer({
  typeDefs: require('./graphql/schema'),
  resolvers: require('./graphql/resolvers')
})

apollo.applyMiddleware({
  app: router,
  path: '/graphql'
})

module.exports = router
