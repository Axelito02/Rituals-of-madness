// Función para iniciar la cámara del dispositivo
// Función para iniciar la cámara del dispositivo
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.getElementById('camera');
    videoElement.srcObject = stream;

    videoElement.addEventListener('play', () => {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      context.canvas.ownerDocument.defaultView.document.willReadFrequently = true;

      // Función para escanear los códigos QR
      const scanFrame = () => {
        context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
        const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log('Código QR detectado:', code.data);
          switch(code.data) {
            case 'Campesino':
              // Redirigir a la página correspondiente para el rol de Campesino
              window.location.href = 'campesino.html';
              break;
            case 'Martyr':
              // Redirigir a la página correspondiente para el rol de Martyr
              window.location.href = 'martyr.html';
              break;
            // Añade más casos para otros roles aquí
            case 'OtroRol1':
              window.location.href = 'otro_rol1.html';
              break;
            case 'OtroRol2':
              window.location.href = 'otro_rol2.html';
              break;
            // Agrega más casos según sea necesario
            default:
              // Si el código no coincide con ninguna de las condiciones anteriores, no hace nada
              break;
          }
        }
        requestAnimationFrame(scanFrame);
      };

      scanFrame();
    });
  } catch (err) {
    console.error('Error al acceder a la cámara: ', err);
  }
}

window.onload = () => startCamera();
