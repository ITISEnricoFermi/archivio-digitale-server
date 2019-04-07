const client = require('../../lib/minio')

const buckets = [client.bucketExists('documents'), client.bucketExists('pics')]

Promise.all(buckets)
  .then(([documents, pics]) => {
    if (!documents) client.makeBucket('documents')
    if (!pics) client.makeBucket('pics')
  })
