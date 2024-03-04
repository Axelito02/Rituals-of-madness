// Lineas de código para el server
const express = require("express");

const expressApp = express();
const PORT = 5050;

const httpServer = expressApp.listen(PORT);
const { Server} = require("socket.io");
const ioServer = new Server(httpServer);

// Asignar carpetas estaticas
const staticQR = express.static('public-camera');
const staticWaitingRoom = express.static('public-waiting-room');
const staticRoles = express.static('public-roles');
const staticVote = express.static('public-votes');

// Asignar rutas para las carpetas estaticas
expressApp.use('/qr', staticQR)
expressApp.use('/waiting', staticWaitingRoom)
expressApp.use('/roles', staticRoles)
expressApp.use('/votes', staticVote)
