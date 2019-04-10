const client = require('../lib/minio')

const getDocument = async (req, res) => {
  const { id } = req.params

  try {
    const requests = [client.statObject('documents', id), client.getObject('documents', id)]
    const [stat, stream] = await Promise.all(requests)

    res.setHeader('Content-Type', stat.metaData['content-type'])
    res.setHeader('Content-Length', stat.size)

    stream.pipe(res)
  } catch (e) {
    return res.status(404).json({
      messages: ['Il documento non esiste.']
    })
  }
}

module.exports = {
  getDocument
}