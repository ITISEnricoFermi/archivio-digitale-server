const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mimetypes.json')))
let mimetypes = []

for (const key of Object.keys(data)) {
  mimetypes = mimetypes.concat(data[key])
}

module.exports = mimetypes
