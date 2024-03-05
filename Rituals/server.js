// Contador para el número de conexiones
let connectionCount = 0;

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

// Manejar conexión de Socket.IO
ioServer.on('connection', (socket) => {
    console.log('Nueva conexión detectada.', socket.id);

    // Evento que recibe los datos del contenido del QR escaneado
        socket.on("QrRole", (role) => {
        console.log(role);

        // Evento que envia los datos del QR escaneado hacia las otras pantallas (carpetas)
        socket.broadcast.emit("rolAsignado", role)

        // Redirigir al cliente a la nueva ruta
        socket.emit('redirect', '/waiting');
    })

        // Manejar redirección
        socket.on('redirect', (destination) => {
            socket.emit('redirect', destination);
        });
});
