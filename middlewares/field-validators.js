const { response } = require('express')
const { validationResult } = require('express-validator')

// Un middleware es practicamente igual a una funcion de controllers, solo que esta tiene next
const validateInputs = (req, res = response, next) => {
  const errors = validationResult( req );
  if( !errors.isEmpty() ){
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }

  // Este next llama a createUser que es la funcion despues de todos los middlewares en el post('/new', middlewares, CREATEUSER)
  // si no tuviera next entonces nunca se llamaria a createUser cuando NO HAYA ERRORES
  // si si hay errores, con o sin next, se va a atorar en el res.status(400)
  next();
}

module.exports = {
  validateInputs,
}