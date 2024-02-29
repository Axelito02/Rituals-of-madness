import playersGame from './assets/playes.js'

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".players");

  // Función para crear un contenedor de jugador con una imagen dada
  function createPlayerContainer(playerData) {
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
});
