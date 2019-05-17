const tee = require('tee-1')
const client = require('./minio')
const sharp = require('sharp')
const MimeChecker = require('./mime_checker')

/**
 * Interfaccia per l'upload dei file sull'object storage.
 */
class Uploader {
  /**
   * Imposta il mimetype e i mimetypes.
   * @param {String} mimetype  Il mimetype con cui salvare il file.
   * @param {Array} mimetypes La lista dei mimetype consentiti.
   */
  constructor (mimetype, mimetypes) {
    this.mimetype = mimetype
    this.mimetypes = mimetypes

    // this.checker.on('error', e => {
    //   this.res.status(415).json({
    //     messages: ['Impossibile caricare il file.']
    //   })
    // })
  }

  /**
   * Carica un file nello store.
   * @param  {String}  bucket   Il nome del bucket in cui salvare il file.
   * @param  {String}  filename Il nome del file da salvare nello store.
   * @param  {WritableStream}  master   Lo stream del file da salvare nello store.
   * @return {Promise}          [description]
   */
  async upload (bucket, filename, master) {
    try {
      return client.putObject(bucket, filename, master.pipe(new MimeChecker({
        mimetypes: this.mimetypes
      })), {
        'Content-type': this.mimetype
      })
    } catch (e) {
      console.log(e)
      throw new Error('Impossibile caricare il file.')
    }
  }

  /**
   * [pics description]
   * @param  {WritableStream}  master Lo stream dell'immagine da salvare nello store.
   * @param  {String}  id     L'ID dello user a cui associare l'immagine.
   * @return {Promise}        [description]
   */
  async pics (master, id) {
    const sizes = [{
      path: 'xlg',
      xy: 1200
    }, {
      path: 'lg',
      xy: 800
    }, {
      path: 'md',
      xy: 500
    }, {
      path: 'sm',
      xy: 300
    }, {
      path: 'xs',
      xy: 100
    }]

    const avatars = (xy) => sharp()
      .resize(xy, xy)
      .toFormat('jpeg')

    const pics = []

    for (let i = 0; i < sizes.length; i++) {
      pics.push(avatars(sizes[i].xy))
    }

    master.pipe(tee(...pics))

    const uploads = []

    for (let i = 0; i < sizes.length; i++) {
      uploads.push(this.upload('pics', id + '/' + sizes[i].path, pics[i]))
    }

    return Promise.all(uploads)
  }
}

module.exports = (mimetype, mimetypes) => new Uploader(mimetype, mimetypes)
