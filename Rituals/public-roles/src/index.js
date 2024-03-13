// Definir la URL de NGROK
const NGROK = " https://10ab-181-50-53-55.ngrok-free.app/votes/";

// Conexion con socket.io
const socket = io();

import imgProfiles from './assets/imgprofile.js';
import infoRoles from './assets/roles.js';

document.addEventListener("DOMContentLoaded", () => {
    const imgProfileContainer = document.querySelector(".imgProfile");
    const allImagesContainer = document.querySelector(".allImages");
    const assignedRoleContainer = document.querySelector(".assignedRole");
    const skillContainer = document.querySelector(".skill p");
    const descriptionContainer = document.querySelector(".descriptionRole p");
    const roleCharacteristicsContainer = document.querySelector(".roleCharacteristics");
    const containerRole = document.querySelector(".containerRole");
    const usernameInput = document.querySelector(".usernameInput");
    const btnConfirm = document.querySelector(".btnConfirm");
    const btnHide = document.querySelector(".btnHide");
    let selectedImageSrc = null;
    let data = {};

    // Función para mostrar la información del rol asignado
    const mostrarInformacionDelRol = (rol) => {
        // Buscar el rol asignado en el array infoRoles
        const roleInfo = infoRoles.find(roleInfo => roleInfo.rol === rol);
        if (roleInfo) {
            // Si se encuentra el rol, actualizar los contenedores HTML con la información correspondiente
            assignedRoleContainer.textContent = rol;
            skillContainer.textContent = roleInfo.skill;
            descriptionContainer.textContent = roleInfo.description;
        } else {
            // Si no se encuentra el rol, mostrar un mensaje de error o realizar alguna acción apropiada
            console.error("No se encontró información para el rol asignado:", rol);
        }
    };

    // Obtener el rol del sessionStorage
    const storedRole = sessionStorage.getItem('qrRole');
    if (storedRole) {
        // Mostrar la información del rol asignado
        mostrarInformacionDelRol(storedRole);
    } else {
        console.error("No se encontró un rol en el sessionStorage.");
    }

    // Función para cargar una imagen aleatoria del array
    const cargarImagenAleatoria = () => {
        const randomIndex = Math.floor(Math.random() * imgProfiles.length);
        const randomImage = imgProfiles[randomIndex].image;
        selectedImageSrc = randomImage;
        const imgElement = document.createElement("img");
        imgElement.src = randomImage;
        imgElement.classList.add("profile-image");
        imgProfileContainer.innerHTML = "";
        imgProfileContainer.appendChild(imgElement);
    }

    // Función para mostrar todas las imágenes al hacer clic
    const mostrarTodasLasImagenes = () => {
        allImagesContainer.style.display = "grid";
        allImagesContainer.style.alignContent = "center";
        allImagesContainer.innerHTML = "";
        imgProfiles.forEach(profile => {
            const imgDiv = document.createElement("div");
            imgDiv.classList.add("imgDiv")
            const imgElement = document.createElement("img");
            imgElement.src = profile.image;
            imgElement.classList.add("profile-image");
            imgDiv.appendChild(imgElement); // Agregar la imagen como hijo del div
            allImagesContainer.appendChild(imgDiv); // Agregar el div al contenedor
        });
    }

    // Cargar una imagen aleatoria al cargar el DOM
    cargarImagenAleatoria();

    // Evento para cargar una imagen aleatoria al hacer clic en la imagen actual
    imgProfileContainer.addEventListener("click", () => {
        mostrarTodasLasImagenes();
    });

    // Evento para seleccionar una imagen del array al hacer clic en ella
    allImagesContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("profile-image")) {
            selectedImageSrc = event.target.src;
            imgProfileContainer.innerHTML = ""; // Limpiar contenedor
            const selectedImgElement = document.createElement("img");
            selectedImgElement.src = selectedImageSrc;
            selectedImgElement.classList.add("profile-image");
            imgProfileContainer.appendChild(selectedImgElement);
            allImagesContainer.style.display = "none";
        }
    });

    // Evento para confirmar la selección del nombre de usuario y la imagen
    btnConfirm.addEventListener("click", () => {
            // Guardar el valor del input y la imagen seleccionada en el objeto 'data'
            data.username = usernameInput.value;
            data.image = selectedImageSrc;
            console.log(data);
            // Enviar los datos a través de socket.io
            socket.emit("userData", data);
        });

    // Evento para ocultar/mostrar la información del rol asignado
    btnHide.addEventListener("click", () => {
        if (roleCharacteristicsContainer.style.display === "none" || roleCharacteristicsContainer.style.display === "") {
            containerRole.style.display = "block";
            roleCharacteristicsContainer.style.display = "block";
            btnHide.textContent = "Ocultar";
        } else {
            containerRole.style.display = "none";
            roleCharacteristicsContainer.style.display = "none";
            btnHide.textContent = "Mostrar";
        }
   });
});
