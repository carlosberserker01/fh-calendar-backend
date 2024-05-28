// Rutas de Usuario / Auth
// host + /api/auth

const { Router } = require('express');
const router = Router();
//es igual que 
// const express = require('express');
// const router = express.Router; no se si lleve parentesis el Router
const { check } = require('express-validator')

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateInputs } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/validate-JWT');

router.post(
  '/new', 
  [ 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
    validateInputs
  ], 
  createUser 
)

router.post(
  '/', 
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
    validateInputs
  ],
  loginUser
)

router.get('/renew', validateJWT, revalidateToken )

module.exports = router;