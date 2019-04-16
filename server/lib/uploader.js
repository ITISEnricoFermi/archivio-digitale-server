const tee = require('tee-1')
const client = require('./minio')
const sharp = require('sharp')
const MimeChecker = require('./mime_checker')

class Uploader {
  constructor (mimetype, mimetypes) {
    this.mimetype = mimetype
    this.mimetypes = mimetypes

    // this.checker.on('error', e => {
    //   this.res.status(415).json({
    //     messages: ['Impossibile caricare il file.']
    //   })
    // })
  }

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

module.exports = (req, mimetypes) => new Uploader(req, mimetypes)
