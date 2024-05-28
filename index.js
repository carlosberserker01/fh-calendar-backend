// Es lo mismo que import express from 'express';
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Variables de DOTENV
require('dotenv').config();

//Crear el servidor de express
const app = express();

// Mongo DATABASE
dbConnection();

// CORS
app.use( cors() )

// Directorio Publico ( Middleware )
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() )

// Rutas
app.use('/api/auth', require( './routes/auth') )
app.use('/api/events', require( './routes/events') )
// TODO: CRUD Eventos

// Escuchar peticiones
app.listen( process.env.PORT, () => {
  console.log(`Server running on port ${ process.env.PORT } ;)`);
} )