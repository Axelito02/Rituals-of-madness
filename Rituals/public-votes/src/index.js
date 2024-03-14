// Definir la URL de NGROK
const NGROK = "https://5faf-186-168-130-109.ngrok-free.app";
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
// Obtener referencia al botón de confirmación desde el DOM
const btnConfirm = document.getElementById('btnConfirm');

// Función para iniciar el contador de tiempo
const startTimer = () => {
    // Duración del contador en segundos
    let countdownDuration = 60; // Por ejemplo, 1 minuto
    console.log("Starting timer...");

    // Función para actualizar el contador de tiempo
    const updateCountdown = () => {
        // Reducir el tiempo restante en 1 segundo
        countdownDuration--;
        countdownElement.textContent = `${countdownDuration}`;

        // Si el tiempo llega a cero o todos los jugadores han votado, detener el contador
        if (countdownDuration === 0 || playersVoted >= totalPlayers) {
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

    // Realizar una solicitud HTTP GET para obtener los datos de los jugadores desde el servidor desde un endpoint
    fetch('/jugadores')
        .then(response => response.json())
        .then(data => {
            // Iterar sobre los datos de los jugadores y crear un contenedor de jugador para cada uno
            data.forEach(playerData => {
                const playerContainer = createPlayerContainer(playerData);
                container.appendChild(playerContainer);
            });

            // Comienza el temporizador cuando se hayan cargado los datos de los jugadores
            startTimer();
            totalPlayers = data.length;
            console.log(totalPlayers);

            //Verificar si el jugador es un Oráculo y mostrar al jugador protegido
            const rolJugador = sessionStorage.getItem('qrRole');
            if (rolJugador === 'Oraculo') {
                // Encontrar al jugador protegido
                const jugadorProtegido = data.find(jugador => jugador.rol === 'Protegido');
                if (jugadorProtegido) {
                    alert(`${jugadorProtegido.username} es Lifeline, ¡Evita que le voten en la siguiente ronda!`);
                } else {
                    alert('No se encontró un jugador protegido.');
                }
            }
            if (rolJugador === 'Secuaz') {
                // Encontrar al jugador traidor
                const jugadorTraidor = data.find(jugador => jugador.rol === 'Traidor');
                if (jugadorTraidor) {
                    alert(`${jugadorTraidor.username} es Traitor, ¡Ayudale a que le voten en la siguiente ronda!`);
                } else {
                    alert('No se encontró un jugador traidor.');
                }
            }
        })
        .catch(error => {
            console.error('Error al obtener datos de jugadores:', error);
        });
});

// Función para crear un contenedor de jugador con su información
let selectedPlayer = null;

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

    containerPlayer.addEventListener('click', () => {
        // Si hay un jugador seleccionado actualmente, deselecciónalo
        if (selectedPlayer !== null) {
            const prevSelectedContainer = document.querySelector(".player-container.selected");
            prevSelectedContainer.classList.remove("selected");
        }

        // Marcar al jugador seleccionado
        selectedPlayer = playerData;
        console.log(selectedPlayer);

        // Resaltar al jugador seleccionado
        containerPlayer.classList.add("selected");
    });

    return containerPlayer;
};

//Enviar voto
btnConfirm.addEventListener("click", () => {
    if (selectedPlayer !== null) {
        socket.emit("VotedPlayer", selectedPlayer);
        console.log('Voted ' + selectedPlayer.username);
    }
    else if (selectedPlayer == null){
        console.log('Error voting');
    }
});

const resultadoVotacionElement = document.getElementById('resultado-votacion');

// Recibe votos totales y los cuenta
socket.on('VotingCount', (voted) => {
    console.log(voted);
    console.log('hay ' + voted.length + ' votos');
    playersVoted = voted.length;
    console.log(playersVoted);

    const resultadoVotacion = contarVotos(voted);
    console.log(`El jugador más votado es ${resultadoVotacion.jugadorMasVotado.username} con ${resultadoVotacion.maxVotos} votos.`);

    if (resultadoVotacion.jugadorMasVotado.rol === "Protegido" || resultadoVotacion.jugadorMasVotado.rol === "Traidor") {
        const ganarPerderElement = document.getElementById('ganar-perder');
        ganarPerderElement.textContent = `¡Ha triunfado el mal!`;
    }

    // Mostrar el resultado de la votación solo una vez terminada la votación
    const resultadoTextoElement = document.getElementById('resultado-texto');
    resultadoTextoElement.textContent = `El jugador más votado es ${resultadoVotacion.jugadorMasVotado.username} con ${resultadoVotacion.maxVotos} votos.`;

    const resultadoRolElement = document.getElementById('resultado-rol');
    resultadoRolElement.textContent = `Su rol era ${resultadoVotacion.jugadorMasVotado.rol}.`;

    const imagenVotadaElement = document.getElementById('imagen-votada');
    // Aquí debes establecer la URL de la imagen votada
    // Puedes acceder a la imagen del jugador más votado desde el objeto resultadoVotacion
    // Por ejemplo, resultadoVotacion.jugadorMasVotado.image
    imagenVotadaElement.src = resultadoVotacion.jugadorMasVotado.image;
    // Establecer estilos adicionales para la imagen, como blanco y negro
    imagenVotadaElement.style.filter = 'grayscale(100%)';

    // Mostrar el contenedor resultado-votacion
    const resultadoVotacionElement = document.getElementById('resultado-votacion');
    resultadoVotacionElement.style.display = 'flex';

    // Eliminar al jugador más votado del endpoint si su rol no es "Protegido" ni "Traidor"
    if (resultadoVotacion.jugadorMasVotado.rol !== "Protegido" || resultadoVotacion.jugadorMasVotado.rol !== "Traidor") {
        eliminarJugadorDelEndpoint(resultadoVotacion.jugadorMasVotado);
    }
});

// Función para eliminar al jugador más votado del endpoint si no es "Protegido" o "Traidor"
const eliminarJugadorDelEndpoint = async (jugadorMasVotado) => {
    try {
        const jugadores = await obtenerJugadoresDelEndpoint(); // Obtener los jugadores del endpoint
        const jugadorAEliminar = jugadores.find(jugador => jugador.username === jugadorMasVotado.username);

        if (!jugadorAEliminar) {
            console.error(`No se encontró al jugador ${jugadorMasVotado.username}.`);
            return;
        }

        const response = await fetch('/jugadores', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jugadorAEliminar)
        });

        if (response.ok) {
            console.log(`El jugador ${jugadorAEliminar.username} ha sido eliminado exitosamente.`);
        } else {
            console.error('Error al intentar eliminar al jugador.');
        }
    } catch (error) {
        console.error('Se produjo un error al intentar eliminar al jugador:', error);
    }
};

const obtenerJugadoresDelEndpoint = async () => {
    try {
        const response = await fetch('/jugadores'); // Obtener la lista de jugadores del endpoint
        if (!response.ok) {
            throw new Error('Error al obtener los jugadores del endpoint.');
        }
        const jugadores = await response.json();
        return jugadores;
    } catch (error) {
        console.error('Error al obtener los jugadores del endpoint:', error);
        return [];
    }
};



// Función para contar los votos totales y el jugador más votado
const contarVotos = (votos) => {
    // Objeto para almacenar el conteo de votos por jugador
    let conteoVotos = {};

    // Recorrer el array de votos
    votos.forEach((jugador) => {
        // Verificar si el jugador ya está en el conteo
        if (conteoVotos[jugador.username]) {
            // Si el jugador ya está en el conteo, incrementar su contador
            conteoVotos[jugador.username]++;
        } else {
            // Si el jugador no está en el conteo, inicializar su contador en 1
            conteoVotos[jugador.username] = 1;
        }
    });

    // Encontrar al jugador con más votos
    let jugadorMasVotado;
    let maxVotos = 0;

    for (let jugador in conteoVotos) {
        if (conteoVotos[jugador] > maxVotos) {
            maxVotos = conteoVotos[jugador];
            jugadorMasVotado = jugador;
        }
    }

    // Buscar el objeto completo del jugador más votado
    const jugadorInfo = votos.find(jugador => jugador.username === jugadorMasVotado);

    // Retornar el objeto completo del jugador más votado y la cantidad de votos
    return { jugadorMasVotado: jugadorInfo, maxVotos };
};
