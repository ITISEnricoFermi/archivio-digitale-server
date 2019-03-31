const client = require('../../lib/minio')

const documents = client.bucketExists('documents')
const pics = client.bucketExists('pics')

if (!documents) client.makeBucket('documents')
if (!pics) client.makeBucket('pics')
