// Definir la URL de NGROK
const NGROK = "https://10ab-181-50-53-55.ngrok-free.app";

// Conexion con socket.io
const socket = io();

let clickCount = 0;
let playersVoted = 0;
let totalPlayers = 0; // Se actualizará desde el servidor
let timerInterval;

// Obtener referencias a los elementos relevantes
const startVoteBtn = document.getElementById('start-vote-btn');
const discussionTimeSection = document.getElementById('discussion-time');
const mainContainerSection = document.getElementById('main-container');
const voteCountText = document.getElementById('vote-count');
const countdownElement = document.getElementById('countdown');

// Escuchar el evento para actualizar el total de jugadores desde el servidor
socket.on('updateTotalPlayers', (total) => {
    totalPlayers = total;
});

// Agregar evento de clic al botón "Iniciar la votación"
startVoteBtn.addEventListener('click', () => {
    clickCount++;
    voteCountText.textContent = `${clickCount}/${totalPlayers} jugadores listos para votar`;

    // Si se han hecho al menos el mismo número de conexiones que el total de jugadores, iniciar la votación
    if (clickCount >= totalPlayers) {
        discussionTimeSection.style.display = 'none';
        mainContainerSection.style.display = 'block';
        startTimer();
    }
});

// Función para iniciar el contador de tiempo
const startTimer = () => {
    // Duración del contador en segundos
    let countdownDuration = 60; // Por ejemplo, 1 minuto

    // Función para actualizar el contador de tiempo
    const updateCountdown = () => {
        // Mostrar el tiempo restante en formato mm:ss
        const minutes = Math.floor(countdownDuration / 60);
        const seconds = countdownDuration % 60;
        countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Reducir el tiempo restante en 1 segundo
        countdownDuration--;

        // Si el tiempo llega a cero o todos los jugadores han votado, detener el contador
        if (countdownDuration < 0 || playersVoted >= totalPlayers) {
            clearInterval(timerInterval); // Detener el contador

            // Si todos los jugadores han votado, puedes realizar acciones adicionales aquí
            if (playersVoted >= totalPlayers) {
                console.log('Todos los jugadores han votado. La votación ha terminado.');
            }
        }
    };

    // Llamar a la función de actualización del contador cada segundo
    timerInterval = setInterval(updateCountdown, 1000);
};

// Función que se ejecuta apenas cargue todos los recursos del DOM
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".players");

    socket.on("userInfo", (userInfo) => {
        // Recibir el objeto userInfo del servidor y crear un contenedor de jugador con su información
        const playerContainer = createPlayerContainer(userInfo);
        container.appendChild(playerContainer);
    });
});

// Función para incrementar el contador de jugadores que han votado
const incrementPlayersVoted = () => {
    playersVoted++;
};

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

    // Agregar evento de clic al contenedor del jugador para permitirle votar
    containerPlayer.addEventListener('click', () => {
        if (!playerData.voted) { // Verificar si el jugador no ha votado aún
            // Emitir el voto del jugador al servidor
            socket.emit('vote', playerData.username);
            playerData.voted = true; // Marcar al jugador como que ya votó
            incrementPlayersVoted(); // Incrementar el contador de jugadores que han votado
        }
    });

    return containerPlayer;
};
