// Event Routes
// host + /api/events

const { Router } = require('express');
const { check } = require('express-validator')
const { validateJWT } = require('../middlewares/validate-JWT');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateInputs } = require('../middlewares/field-validators');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Middleware. Cualquier peticion abajo de este use tendra el validateJWT
router.use( validateJWT )

// Cargar eventos
router.get('/', getEvents)

// Crear nuevo eventos
router.post(
  '/', 
  // NOT EMPTY = QUE NO SEA VACIO
  [ 
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
    validateInputs
  ],
  createEvent
)

// Actualizar evento
// Si yo le puse id aqui quiere decir que en req.params voy a recibirlo como id
router.put('/:id', updateEvent)

// Borrar evento
router.delete('/:id', deleteEvent)

module.exports = router;