// Definir la URL de NGROK
const NGROK = "https://55fd-190-130-97-32.ngrok-free.app";
// Conexion con socket.io
const socket = io();

let playersVoted = 0; // Se actualizará desde el servidor
let totalPlayers = 0; 
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
    let countdownDuration = 60;
    console.log("Starting timer...");

    // Función para actualizar el contador de tiempo
    const updateCountdown = () => {
        // Reducir el tiempo restante en 1 segundo
        countdownDuration--;
        countdownElement.textContent = `${countdownDuration}`;

        // Si el tiempo llega a cero o todos los jugadores han votado, detener el contador
        if (countdownDuration === 0 || playersVoted >= totalPlayers) {
            clearInterval(timerInterval); // Detener el contador

            console.log('La votación ha terminado.');
            // Si todos los jugadores han votado
            if (playersVoted >= totalPlayers) {
                console.log('Todos los jugadores han votado.');
            } else {
                // Si nadie ha votado, votar por un jugador al azar
                if (selectedPlayer === null) {
                    // Obtener un jugador al azar
                    const randomIndex = Math.floor(Math.random() * totalPlayers);
                    const randomPlayer = data[randomIndex];

                    // Simular el voto por ese jugador
                    selectedPlayer = randomPlayer;
                    console.log('Voting for random player: ' + selectedPlayer.username);

                    // Emitir el voto al servidor
                    socket.emit("VotedPlayer", selectedPlayer);

                    // Deshabilitar el botón de votar después de votar
                    btnConfirm.classList.add("disabled");
                    btnConfirm.disabled = true;
                }
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

            //Verificar si el jugador es un Oráculo y mostrar al jugador Protegido
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
            
            //Verificar si el jugador es un Secuaz y mostrar al jugador Traidor
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
        // Si hay un jugador seleccionado actualmente, se deselecciona
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
        // Deshabilitar el botón de votar después de votar

        // Deshabilitar el botón de votar si ya se ha votado
            btnConfirm.classList.add("disabled");

        btnConfirm.disabled = true;
    } else {
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

    //Pierde si el rol votado era Protegido o Traidor
    if (resultadoVotacion.jugadorMasVotado.rol === "Protegido" || resultadoVotacion.jugadorMasVotado.rol === "Traidor") {
        const ganarPerderElement = document.getElementById('ganar-perder');
        ganarPerderElement.textContent = "¡Ha triunfado el mal!";
        const perdedoresElement = document.getElementById('perdedores');
        perdedoresElement.textContent = "Solo sobreviven Traitor y Lackey";
    }

    //Sigue si NO se votó a Protegido  o Traidor
    //Lo ideal es que borre al votado del array de jugadores, se repite la votación en ronda 2 y luego en 3
    if (resultadoVotacion.jugadorMasVotado.rol !== "Protegido" && resultadoVotacion.jugadorMasVotado.rol !== "Traidor") {
        const ganarPerderElement = document.getElementById('ganar-perder');
        ganarPerderElement.textContent = "¡El festival continua!";
        const perdedoresElement = document.getElementById('perdedores');
        perdedoresElement.textContent = "Sigue votando para saber como termina...";
    }

     // Eliminar al jugador más votado del endpoint si su rol no es "Protegido" ni "Traidor"
    // if (resultadoVotacion.jugadorMasVotado.rol !== "Protegido" || resultadoVotacion.jugadorMasVotado.rol !== "Traidor") {
    //     eliminarJugador(resultadoVotacion.jugadorMasVotado.username);
    // } //aun no funciona

    // Mostrar el resultado de la votación solo una vez terminada la votación
    const resultadoTextoElement = document.getElementById('resultado-texto');
    resultadoTextoElement.textContent = `El jugador más votado es ${resultadoVotacion.jugadorMasVotado.username} con ${resultadoVotacion.maxVotos} votos.`;

    const resultadoRolElement = document.getElementById('resultado-rol');
    resultadoRolElement.textContent = `Su rol era ${resultadoVotacion.jugadorMasVotado.rol}.`;

    const imagenVotadaElement = document.getElementById('imagen-votada');
    imagenVotadaElement.src = resultadoVotacion.jugadorMasVotado.image;
    imagenVotadaElement.style.filter = 'grayscale(100%)';

    // Mostrar el contenedor resultado-votacion
    const resultadoVotacionElement = document.getElementById('resultado-votacion');
    resultadoVotacionElement.style.display = 'flex';
});

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