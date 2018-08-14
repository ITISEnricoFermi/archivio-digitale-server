const joi = require('joi')

const create = joi.object().keys({
  name:
  joi.string().error(new Error('Il titolo del documento deve essere una stringa.'))
    .min(1).error(new Error('Il titolo del documento deve essere specificato.'))
    .required().error(new Error('Il titolo del documento deve essere specificato.')),
  type:
  joi.string().error(new Error('Il tipo di documento deve essere una stringa.'))
    .min(1).error(new Error('Il tipo di documento deve essere specificato.'))
    .trim()
    .lowercase()
    .required().error(new Error('Il tipo di documento deve essere specificato.')),
  // author:
  // joi.string().error(new Error('L\'autore del documento deve essere una stringa.'))
  //   .min(1).error(new Error('L\'autore del documento deve essere specificato.'))
  //   .trim()
  //   .required().error(new Error('L\'autore del documento deve essere specificato.')),
  faculty:
  joi.string().error(new Error('Il campo Specializzazione deve essere una stringa.'))
    .min(1).error(new Error('Il campo Specializzazione deve essere specificato.'))
    .trim()
    .lowercase()
    .required().error(new Error('Il campo Specializzazione deve essere specificato.')),
  subject:
  joi.string().error(new Error('Il campo Materia deve essere una stringa.'))
    .min(1).error(new Error('Il campo Materia deve essere specificato.'))
    .trim()
    .lowercase()
    .required().error(new Error('Il campo Materia deve essere specificato.')),
  grade:
  joi.number().error(new Error('Il campo Classe deve essere un numero.'))
    .min(1).error(new Error('Il campo Classe deve essere specificato.'))
    .integer().error(new Error('Il campo Classe deve essere un numero intero.'))
    .positive().error(new Error('Il campo Classe deve essere un numero positivo.'))
    .required().error(new Error('Il campo Classe deve essere specificato.')),
  section:
  joi.string().error(new Error('Il campo Sezione deve essere una stringa.'))
    .min(1).error(new Error('Il campo Sezione deve essere specificato.'))
    .trim()
    .lowercase()
    .alphanum().error(new Error('Il campo Sezione deve contenere solo caratteri alfanumerici.'))
    .required().error(new Error('Il campo Sezione deve essere specificato.')),
  visibility:
  joi.string().error(new Error('Il campo Visibilità deve essere una stringa.'))
    .min(1).error(new Error('Il campo Visibilità deve essere specificato.'))
    .trim()
    .lowercase()
    .required().error(new Error('Il campo Visibilità deve essere specificato.')),
  description:
  joi.string().error(new Error('Il campo Descrizione deve essere una stringa.'))
    .min(1).error(new Error('Il campo Descrizione deve essere specificato.'))
    .required().error(new Error('Il campo Descrizione deve essere specificato.'))
})

module.exports = {
  create (data) {
    const { error } = joi.validate(data, create)
    if (error) throw error
    return false
  }
}
