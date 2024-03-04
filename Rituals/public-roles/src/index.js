import imgProfiles from './assets/imgprofile.js';

document.addEventListener("DOMContentLoaded", () => {
    const imgProfileContainer = document.querySelector(".imgProfile");

    // Función para cargar una imagen aleatoria del array
    const cargarImagenAleatoria = () => {
        const randomIndex = Math.floor(Math.random() * imgProfiles.length);
        const randomImage = imgProfiles[randomIndex].image;
        const imgElement = document.createElement("img");
        imgElement.src = randomImage;
        imgElement.classList.add("profile-image");
        imgProfileContainer.innerHTML = "";
        imgProfileContainer.appendChild(imgElement);   
    }

    // Función para mostrar todas las imágenes al hacer clic
    const mostrarTodasLasImagenes = () => {
        imgProfileContainer.innerHTML = "";
        imgProfiles.forEach(profile => {
            const imgElement = document.createElement("img");
            imgElement.src = profile.image;
            imgElement.classList.add("profile-image");
            imgProfileContainer.appendChild(imgElement);
        });
    }

    // Cargar una imagen aleatoria al cargar el DOM
    cargarImagenAleatoria();

    // Evento para cargar una imagen aleatoria al hacer clic en la imagen actual
    imgProfileContainer.addEventListener("click", () => {
        mostrarTodasLasImagenes();
    });

    // Evento para seleccionar una imagen del array al hacer clic en ella
    imgProfileContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("profile-image")) {
            const selectedImageSrc = event.target.src;
            imgProfileContainer.innerHTML = ""; // Limpiar contenedor
            const selectedImgElement = document.createElement("img");
            selectedImgElement.src = selectedImageSrc;
            selectedImgElement.classList.add("profile-image");
            imgProfileContainer.appendChild(selectedImgElement);
        }
    });
})
