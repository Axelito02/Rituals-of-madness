import playersGame from './assets/playes.js'

// Cosas por hacer importante
  // - limitar la cantidad de clicks detectar la cantidad de jugadores (conexiones en la sección actual)
  // - Agregar condición para desabilitar el botón a los jugadores que ya decidieron seguir
  // - Hacer el contador de 1 minuto para la votación

let timeVote = 60;
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

  // Función para crear un contenedor de jugador con su información
  const createPlayerContainer = (playerData) => {
    const containerPlayer = document.createElement("div");
    containerPlayer.classList.add("player-container");

    const imgPlayer = document.createElement("img");
    imgPlayer.classList.add("player-img");
    imgPlayer.src = playerData.img;

    const playerName = document.createElement("h4");
    playerName.textContent = playerData.name;
    containerPlayer.appendChild(imgPlayer);
    containerPlayer.appendChild(playerName);

    containerPlayer.appendChild(imgPlayer);
    return containerPlayer;
  }

  // Crear contenedores para cada jugador e insertarlos en el contenedor principal
  playersGame.forEach(playerData => {
    const playerContainer = createPlayerContainer(playerData);
    container.appendChild(playerContainer);
  });

  //   // Función para actualizar el contador de tiempo
  //     const updateTimer = () => {
  //     const countdownElement = document.getElementById('countdown');
  //     const minutes = Math.floor(timeVote / 10);
  //     const seconds = timeVote % 60;
  //     const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  //     countdownElement.textContent = formattedTime;

  //     // Reducir el tiempo restante en cada intervalo
  //     if (timeVote > 0) {
  //         timeVote--;
  //         setTimeout(updateTimer, 1000); // Llama a esta función nuevamente después de 1 segundo
  //     }
  // };
});
