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
  }

  /**
   * Carica un file nello store.
   * @param  {String}  bucket   Il nome del bucket in cui salvare il file.
   * @param  {String}  filename Il nome del file da salvare nello store.
   * @param  {WritableStream}  master   Lo stream del file da salvare nello store.
   * @return {Promise}          [description]
   */
  upload (bucket, filename, master, checker) {
    return new Promise((resolve, reject) => {
      client.putObject(bucket, filename,
        master

        //   master.pipe(new MimeChecker({
        //   mimetypes: this.mimetypes
        // }).on('error', e => {
        //   console.log('Errore:', e)
        //   reject(new Error('Impossibile caricare il file.')) // questo non viene catturato perché sta dentro la funzione dell'evento error
        // }))

        , {
          'Content-type': this.mimetype
        })
        .then(resolve)
    })
  }

  async file (filename, master) {
    try {
      return this.upload('documents', filename, master)
    } catch (e) {
      throw new Error('Impossibile caricare il documento.')
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
      .on('error', e => {
        console.log('Errore')
      })

    const pics = []

    for (let i = 0; i < sizes.length; i++) {
      pics.push(avatars(sizes[i].xy))
    }
    /*
      IL PROBLEMA È IN QUESTA FUNZIONE. IL PROBLEMA DEL MEMORY LEAK.
      IL PROBLEMA DEL NON CARICAMENTO STA NELL'IF DEL MIME CHECKER.
      IL MIME CHECKER VIENE ESEGUITO NELLA FUNZIONE UPLOAD, QUINDI È GIÀ PASSATO IN JPEG E IO VOGLIO SVG
      PROBLEMA DELLE PROMISE NON CATTURATE PERCHÉ LA FUNZIONE STA NELL'EVENT
     */
    // master.pipe.pipe(mimechecker.pipe(tee(...pics)))
    master.pipe(tee(...pics))

    const uploads = []

    for (let i = 0; i < sizes.length; i++) {
      uploads.push(this.upload('pics', id.concat('/', sizes[i].path), pics[i]))
    }

    return Promise.all(uploads)
  }
}

module.exports = (mimetype, mimetypes) => new Uploader(mimetype, mimetypes)
