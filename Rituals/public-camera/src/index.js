// Conexion con socket.io
const socket = io();

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
          socket.emit("QrRole", code.data)
          window.location.href = "http://localhost:5050/waiting/";
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
