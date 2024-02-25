// Función para iniciar la cámara del dispositivo

async function startCamera() {
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
          // window.open(code.data, '_blank')
        }
        requestAnimationFrame(scanFrame);
      };

      scanFrame();
    });
  } catch (err) {
    console.error('Error al acceder a la cámara: ', err);
  }
}

window.onload = function() {
  startCamera();
};
