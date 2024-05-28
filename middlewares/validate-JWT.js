const { response } = require('express');
const jwt = require('jsonwebtoken')

const validateJWT = ( req, res = response, next ) => {

  // x-token headers
  const token = req.header('x-token');

  if ( !token ) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la peticion'
    })
  }

  try {
    
    // De todo el token, extrae el payload (lo de enmedio). En el payload alojamos uid y name por lo que podemos extraerlo de aqui y pegarselo al req para que se pueda consultar en cualquier lado
    const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );

    req.uid = uid
    req.name = name

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido'
    })
  }

  next();

}

module.exports = {
  validateJWT
}