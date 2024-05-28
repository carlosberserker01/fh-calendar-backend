const { response } = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

// res = response es para tener el tipado de res. y que te autocomplete
const createUser = async( req, res = response ) => {

  //Si solo tengo un res. esta bien, si tengo 2 o mas hay que ponerle return para que regrese eso
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email })
    if ( user ) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con este email.'
      })
    }
    user = new User( req.body );

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt )

    await user.save();

    // Generar JWT con id y name como payload del token para posteriormente pegar el id y el name en el req de cualquier peticion y saber siempre el nombre y id del usuario
    const token = await generateJWT( user.id, user.name );

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

const loginUser = async(req, res = response ) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email })
    if ( !user ) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe ningun usuario con ese email.'
      })
    }

    const validPassword = bcrypt.compareSync( password, user.password );

    if( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // Generar JWT
    const token = await generateJWT( user.id, user.name );

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

const revalidateToken = async( req, res = response ) => {

  const { uid, name } = req;

  const token = await generateJWT( uid, name );

  res.json({
    ok: true,
    uid,
    name,
    token
  })
}

module.exports = { 
  createUser,
  loginUser,
  revalidateToken
}