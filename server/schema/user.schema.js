const joi = require('joi')

const signup = joi.object().keys({
  firstname:
  joi.string().error(new Error('Il campo del Nome deve essere di tipo stringa.'))
    .min(1).error(new Error('Il campo del Nome deve essere specificato.'))
    .required().error(new Error('Il campo del Nome deve essere specificato.')),
  lastname:
  joi.string().error(new Error('Il campo del Cognome deve essere di tipo stringa.'))
    .min(1).error(new Error('Il campo del Cognome deve essere specificato.'))
    .required().error(new Error('Il campo del Cognome deve essere specificato.')),
  email:
  joi.string().error(new Error('Il campo dell\'Email deve essere di tipo stringa.'))
    .email().error(new Error('Il campo dell\'e-mail deve essere un indirizzo e-mail valido.'))
    .min(1).error(new Error('Il campo dell\'Email deve essere specificato.'))
    .required().error(new Error('Il campo dell\'Email deve essere specificato.')),
  password:
  joi.string().error(new Error('Il campo della password deve essere di tipo stringa.'))
    .trim()
    .min(10).error(new Error('La password deve avere una lunghezza minima di 6 caratteri.'))
    .required().error(new Error('Il campo della Password deve essere specificato.')),
  accesses:
  joi.array().error(new Error('La lista deggli accessi deve essere un array.'))
    .items(joi.string().error(new Error('Un elemento della lista degli accessi deve essere di tipo stringa.'))
      .trim()
      .lowercase())
    .single()
    .unique()
    .min(1).error(new Error('La lista degli accessi deve contenere almeno un elemento.'))
    .required().error(new Error('La lista degli accessi deve essere specificata.'))
})

const create = joi.object().keys({
  firstname:
  joi.string().error(new Error('Il campo del Nome deve essere di tipo stringa.'))
    .min(1).error(new Error('Il campo del Nome deve essere specificato.'))
    .required().error(new Error('Il campo del Nome deve essere specificato.')),
  lastname:
  joi.string().error(new Error('Il campo del Cognome deve essere di tipo stringa.'))
    .min(1).error(new Error('Il campo del Cognome deve essere specificato.'))
    .required().error(new Error('Il campo del Cognome deve essere specificato.')),
  email:
  joi.string().error(new Error('Il campo dell\'Email deve essere di tipo stringa.'))
    .email().error(new Error('Il campo dell\'e-mail deve essere un indirizzo e-mail valido.'))
    .min(1).error(new Error('Il campo dell\'Email deve essere specificato.'))
    .required().error(new Error('Il campo dell\'Email deve essere specificato.')),
  password:
  joi.string().error(new Error('Il campo della password deve essere di tipo stringa.'))
    .trim()
    .min(10).error(new Error('La password deve avere una lunghezza minima di 6 caratteri.'))
    .required().error(new Error('Il campo della Password deve essere specificato.')),
  accesses:
  joi.array().error(new Error('La lista degli accessi deve essere un array.'))
    .items(joi.string().error(new Error('Un elemento della lista degli accessi deve essere di tipo stringa.'))
      .trim()
      .lowercase())
    .single()
    .unique()
    .min(1).error(new Error('La lista degli accessi deve contenere almeno un elemento.'))
    .required().error(new Error('La lista degli accessi deve essere specificata.')),
  privileges:
  joi.string().error(new Error('Il campo dei Privilegi deve essere di tipo stringa.'))
    .trim()
    .lowercase()
    .min(1).error(new Error('Il campo dei Privilegi deve essere specificato.'))
    .required().error(new Error('Il campo dei Privilegi deve essere specificato.'))
  // state:
  // joi.string().error(new Error('Il campo dello Stato di Attivazione deve essere di tipo stringa.'))
  //   .trim()
  //   .lowercase()
  //   .min(1).error(new Error('Il campo dello Stato di Attivazione deve essere specificato.'))
  //   .required().error(new Error('Il campo dello Stato di Attivazione deve essere specificato.'))
})

module.exports = {
  signup (data) {
    const { error } = joi.validate(data, signup)
    if (error) throw error
    return true
  },
  create (data) {
    const { error } = joi.validate(data, create)
    if (error) throw error
    return false
  }
}
