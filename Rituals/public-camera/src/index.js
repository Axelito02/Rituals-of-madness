// Definir la URL de NGROK
const NGROK = "https://55fd-190-130-97-32.ngrok-free.app/waiting/";

// Conexion con socket.io
const socket = io();

let qrDetected = false; // Indicar si se detectó un código QR

// Función para iniciar la cámara del dispositivo
const startCamera = async () => {
  try {
    let constraints;
    // Verificar si el dispositivo tiene cámara trasera y establecer las restricciones adecuadas
    if (navigator.mediaDevices.getSupportedConstraints().facingMode) {
      constraints = { video: { facingMode: "environment" } }; // Cámara trasera
    } else {
      constraints = { video: { facingMode: "user" } }; // Cámara frontal
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
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

        if (code && !qrDetected) {
          qrDetected = true;
          console.log('Código QR detectado:', code.data);
          
          // Guardar el rol en sessionStorage
          sessionStorage.setItem('qrRole', code.data);

          // Redirigir a la página de NGROK
          window.location.href = NGROK;
        }
        requestAnimationFrame(scanFrame)
      }

      scanFrame();
    });
  } catch (err) {
    console.error('Error al acceder a la cámara: ', err);
  }
}

window.onload = () => startCamera();