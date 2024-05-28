const Event = require("../models/Event");

const getEvents = async( req, res ) => {

  const events = await Event.find().populate('user', 'name')
  // Si quiero todo el user dejo populate('user'), si quiero solo un campo seria 'user', campoQueQuiero, si quiero mas los separo con un espacio
  // const events = await Event.find().populate('user', 'name password')

  res.json({
    ok: true,
    events
  })
}

const createEvent = async( req, res ) => {

  const event = new Event( req.body );

  try {
    event.user = req.uid;
    const savedEvent = await event.save()

    res.json({
      ok: true,
      'event': savedEvent
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const updateEvent = async( req, res ) => {

  const eventId = req.params.id;
  const uid = req.uid

  try {
    
    const event = await Event.findById( eventId );

    if ( !event ) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ningun evento con ese id'
      })
    }

    if ( event.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento'
      })
    }

    const updatedEventObj = {
      ...req.body,
      user: uid
    }

    // con new en true quiere decir que me va a regresar el evento nuevo en el res.json, si se lo quito me regresa el evento como estaba por si quiero hacer alguna compracion
    const updatedEvent = await Event.findByIdAndUpdate( eventId, updatedEventObj, { new: true } )

    res.json({
      ok: true,
      'event': updatedEvent
    })



  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const deleteEvent = async( req, res ) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {

    const event = await Event.findById( eventId );

    if ( !event ) {
      return res.json({
        ok: false,
        msg: 'No existe ningun evento con ese id'
      })
    }

    if( event.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No puede borrar un evento que usted no creo'
      })
    }

    await Event.findByIdAndDelete( eventId );

    res.json({
      ok: true,
      msg: 'Evento eliminado'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
}