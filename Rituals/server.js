const NGROK = 'https://5faf-186-168-130-109.ngrok-free.app'
// Contador para el número de conexiones
let connectionCount = 1;
let voteConnection = 1;

// Lineas de código para el server
const express = require("express");

const expressApp = express();
const PORT = 5050;

const httpServer = expressApp.listen(PORT);
const { Server } = require("socket.io");
const ioServer = new Server(httpServer);

// Asignar carpetas estaticas
const staticQR = express.static('public-camera');
const staticWaitingRoom = express.static('public-waiting-room');
const staticWaitingVoting = express.static('public-waiting-voting');
const staticRoles = express.static('public-roles');
const staticVote = express.static('public-votes');

// Asignar rutas para las carpetas estaticas
expressApp.use('/qr', staticQR)
expressApp.use('/waiting', staticWaitingRoom)
expressApp.use('/waitingVoting', staticWaitingVoting)
expressApp.use('/roles', staticRoles)
expressApp.use('/votes', staticVote)

let jugadores = [
    {
    username: "Isa",
    image: `${NGROK}/roles/src/assets/Img/Personaje11.png`,
    rol: "Protegido"
    },
    {
    username: "Otra",
    image: `${NGROK}/roles/src/assets/Img/Personaje2.png`,
    rol: "Traidor"
    },
    {
    username: "Rawr",
    image: `${NGROK}/roles/src/assets/Img/Personaje7.png`,
    rol: "Ciudadano"
    }
];

let voted = []
let totalVotes = 1

// Manejar conexión de Socket.IO
ioServer.on('connection', (socket) => {
    const url = socket.request.headers.referer;

    console.log(connectionCount, 'conexiones detectadas');

    // Incrementar el contador de conexiones
    connectionCount++;

    // Obtener los datos de la pantalla roles
    socket.on('userData', (data) => {
        console.log(data);
        jugadores.push(data);
        socket.broadcast.emit('userInfo', data);
    });

    if (url.includes(`${NGROK}/waitingVoting`)) {
        voteConnection++
        console.log(voteConnection-1, 'listos para votar');
    }

    if (connectionCount === voteConnection) {
            // Enviar mensaje "iniciaVotacion" por socket
            console.log('Inicia votacion')
            socket.broadcast.emit('iniciaVotacion', 'iniciaVotacion');
    }

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        // Decrementar el contador de conexiones al desconectar un usuario
        connectionCount--;

        // Emitir el número actualizado de conexiones
        socket.broadcast.emit('connectionCount', connectionCount);
    });

    expressApp.get('/jugadores', (req, res) => {
        // Devolver el array de jugadores como respuesta
        res.json(jugadores);
    });

    socket.on('VotedPlayer', (data) => {
        voted.push(data)
        totalVotes++
        console.log(data.username + ' fue votado');
        console.log((totalVotes - 1) + ' han votado');
        setTimeout(() => {
        if(totalVotes === connectionCount){
            console.log(voted);
                // Esta es la función que se ejecutará después de cierto tiempo
                socket.broadcast.emit('VotingCount', voted)
            }
            }, 5000);
    });
    
});
