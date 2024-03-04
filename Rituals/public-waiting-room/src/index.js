import tipsGame from './assets/Tips/tips.js';

document.addEventListener("DOMContentLoaded", () => {
    const tipsContainerTitle = document.querySelector('.tipsTitle');
    const tipsContainerText = document.querySelector('.tipsText');

    const displayRandomTip = () => {
        // Obtener un índice aleatorio
        const randomIndex = Math.floor(Math.random() * tipsGame.length);

        // Mostrar el consejo aleatorio en el contenedor
        tipsContainerTitle.textContent = tipsGame[randomIndex].title;
        tipsContainerText.textContent = tipsGame[randomIndex].tip;
    }

    // Mostrar un consejo aleatorio inicialmente
    displayRandomTip();

    // Cambiar el consejo cada x segundos
    setInterval(displayRandomTip, 3000);
});
