const client = require('../../lib/minio')

const exist = [client.bucketExists('documents'), client.bucketExists('pics')]

Promise.all(exist)
  .then(([documents, pics]) => {
    const bucktes = []
    if (!documents.length) bucktes.push(client.makeBucket('documents'))
    if (!pics.length) bucktes.push(client.makeBucket('pics'))

    // Distinguere per ogni bucket
    return Promise.all(bucktes)
      .then(([documents, pics]) => {
        console.log('Bucket di default creati con successo.')
      })
  })
  .catch(e => {
    console.log('Impossibile creare i Bucket di default.')
  })
