// Contador para el número de conexiones
let connectionCount = 1;

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
    console.log(connectionCount, 'conexiones detectadas');

    // Incrementar el contador de conexiones
    connectionCount++;

    // Evento que recibe los datos del contenido del QR escaneado
    socket.on("QrRole", (role) => {
        console.log(role);

        // Evento que envía los datos del QR escaneado hacia la conexión que lo solicitó
        socket.emit("rolAsignado", role);
    });

    // Obtener los datos de la pantalla roles
    socket.on('userData', (data) => {
        console.log(data);
        socket.broadcast.emit('userInfo', data);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        // Decrementar el contador de conexiones al desconectar un usuario
        connectionCount--;

        // Emitir el número actualizado de conexiones
        socket.broadcast.emit('connectionCount', connectionCount);
    });
});

