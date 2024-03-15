const NGROK = `https://55fd-190-130-97-32.ngrok-free.app/roles`

// Conexion con socket.io
const socket = io();

import tipsGame from './assets/Tips/tips.js';
import onlinePlayers from './assets/conectionCounts/conections.js';

let playerMinimums = 8;
let countdown;
let time = 5;

document.addEventListener("DOMContentLoaded", () => {
    const tipsContainerTitle = document.querySelector('.tipsTitle');
    const tipsContainerText = document.querySelector('.tipsText');
    const onlinePlayersContainer = document.querySelector('.imgConnection');

    // Escuchar el evento 'connectionCount' del servidor y actualizar la imagen y el mensaje
    // socket.on('connectionCount', (count) => {
    //     console.log('Número de conexiones:', count);
    //     displayConnectionImage(count);
    // });

    socket.on("playersConnected", (message) => {
        console.log('Número de conexiones:', message);
        displayConnectionImage(message);
    });

    socket.on("iniciaJuego", (message) => {
        console.log(message);
        window.location.href = NGROK;
    });

    const displayRandomTip = () => {
        // Obtener un índice aleatorio
        const randomIndex = Math.floor(Math.random() * tipsGame.length);

        // Mostrar el consejo aleatorio en el contenedor
        tipsContainerTitle.textContent = tipsGame[randomIndex].title;
        tipsContainerText.textContent = tipsGame[randomIndex].tip;
    }

    // Función para mostrar la imagen correspondiente al número de conexiones
    const displayConnectionImage = (count) => {
        const player = onlinePlayers.find(player => player.count === count);            
        const playerCount = playerMinimums - count;

        if (player) {
            onlinePlayersContainer.innerHTML = `<img src="${player.image}" alt="feedbackConnectionPlayer"> <p> Esperando a ${playerCount} jugadores...</p>`;
        }

        if(playerCount <= 0){
           onlinePlayersContainer.innerHTML = `<img src="./src/assets/Img/conection4.png" alt="feedbackConnectionPlayer"><p> ${count} jugadores conectados</p> <p> La partida empieza en ${time} segundos</p>`;

           clearInterval(countdown);
           time = 5;

           countdown = setInterval(() => {
               if (time === 0) {
                   clearInterval(countdown);
                //    window.location.href = NGROK;

               } else {
                   onlinePlayersContainer.innerHTML = `<img src="./src/assets/Img/conection4.png" alt="feedbackConnectionPlayer"> <p> ${count} jugadores conectados</p> <p> La partida empieza en ${time} segundos</p>`;
                   time--;
               }
           }, 1000);
        }
    };

    // Mostrar un consejo aleatorio inicialmente
    displayRandomTip();

    // Cambiar el consejo cada x segundos
    setInterval(displayRandomTip, 3000);
});
