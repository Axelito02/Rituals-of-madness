// Definir la URL de NGROK
const NGROK = "https://55fd-190-130-97-32.ngrok-free.app/votes/";
// const fireStoreDB = require("./firebase-config");
// Conexion con socket.io
const socket = io();

let clickCount = 0;
let playersVoted = 0;
let totalPlayers = 0; // Se actualizará desde el servidor
let timerInterval;

// Obtener referencias a los elementos relevantes
const discussionTimeSection = document.getElementById('discussion-time');
const mainContainerSection = document.getElementById('main-container');
const voteCountText = document.getElementById('vote-count');
const countdownElement = document.getElementById('countdown');

// Escuchar el evento para actualizar el total de jugadores desde el servidor
socket.on('updateTotalPlayers', (total) => {
    totalPlayers = total;
});

socket.on("iniciaVotacion", (message) => {
    console.log(message);
    window.location.href = NGROK
});