const { Client } = require('elasticsearch')

const port = 9200
const host = process.env.ES_HOST || "localhost"
const client = new Client({ host: { host, port } })
const maxtry = 10
let ntry = 0

async function checkConnection() {
  let isConnected = false
  while (!isConnected) {
    console.log('Connecting to ES...')
    try {
      const health = await client.cluster.health({})
      console.log(health)
      isConnected = true
    } catch (e) {
      if (ntry > maxtry) return process.exit(1)
      ntry++
      console.error('Connection Failed, Retrying in 1 second', e)
      setTimeout(checkConnection,1000)
    }
  }
}

checkConnection()


module.exports = {
  client
}