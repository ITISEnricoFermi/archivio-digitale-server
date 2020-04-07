const client = require('../../lib/minio')
const { red, green, yellow } = require('colors')

Promise.all([client.bucketExists('documents'), client.bucketExists('pics')])
  .then(([documents, pics]) => {
    const bucktes = []
    if (!documents) bucktes.push(client.makeBucket('documents'))
    if (!pics) bucktes.push(client.makeBucket('pics'))

    if (!bucktes.length) {
      return console.log(yellow('I bucket di default sono già stati creati.'))
    }

    // Distinguere per ogni bucket
    return Promise.all(bucktes)
      .then((buckets) => {
        console.log(green('Bucket di default creati con successo.'))
      })
  })
  .catch(e => {
    console.log(red('Impossibile creare i Bucket di default.'))
  })
