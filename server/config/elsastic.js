const { Client } = require('elasticsearch')

const port = 9200
const host = process.env.ES_HOST || "localhost"
const client = new Client({ host: { host, port } })

async function checkConnection() {
  let isConnected = false
  while (!isConnected) {
    console.log('Connecting to ES...')
    try {
      const health = await client.cluster.health({})
      console.log(health)
      isConnected = true
    } catch (e) {
      console.error('Connection Failed, Retrying...', e)
    }
  }
}

checkConnection()


module.exports = {
  client
}