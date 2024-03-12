// Conexion con socket.io
const socket = io();

// Array de prueba para ver si pintaba correctamente
// import playersGame from './assets/playes.js'

let clickCount = 0;

// Obtener referencias a los elementos relevantes
const startVoteBtn = document.getElementById('start-vote-btn');
const discussionTimeSection = document.getElementById('discussion-time');
const mainContainerSection = document.getElementById('main-container');
const voteCountText = document.getElementById('vote-count');

  // Agregar evento de clic al botón "Iniciar la votación"
  startVoteBtn.addEventListener('click', () => {

  clickCount++;
  voteCountText.textContent = `${clickCount}/4 jugadores listos para votar`;

  // Si se han hecho al menos 4 clics, ocultar la sección de discusión y mostrar la sección principal

  if (clickCount >= 4) {
      discussionTimeSection.style.display = 'none';
      mainContainerSection.style.display = 'block';
    }
});

// Función que se ejecuta apenas cargue todo los recursos del DOM
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".players");

  socket.on("userInfo", (userInfo) => {
    console.log(userInfo);
    // Recibir el objeto userInfo del servidor y crear un contenedor de jugador con su información
    const playerContainer = createPlayerContainer(userInfo);
    container.appendChild(playerContainer);
  });

  // Función para crear un contenedor de jugador con su información
  const createPlayerContainer = (playerData) => {
    const containerPlayer = document.createElement("div");
    containerPlayer.classList.add("player-container");

    const imgPlayer = document.createElement("img");
    imgPlayer.classList.add("player-img");
    imgPlayer.src = playerData.image;

    const playerName = document.createElement("h4");
    playerName.textContent = playerData.username;
    
    containerPlayer.appendChild(imgPlayer);
    containerPlayer.appendChild(playerName);

    return containerPlayer;
  }
});
