import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const Camera = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const webcamRef = useRef(null);

  const handleScan = () => {
    const video = webcamRef.current?.video;

    if (video) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Establecer las dimensiones del canvas según el video
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      // Dibujar el frame actual del video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obtener los datos de la imagen del canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setScannedCode(code.data); // Almacena el código escaneado
      }
    }
  };

  // Usamos useEffect para realizar un escaneo cada 10 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleScan();
    }, 10000); // Escanea cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Cámara del dispositivo</h1>
      <div style={{ width: "100%", height: "400px" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment", // Usa la cámara trasera en móviles
          }}
        />
      </div>

      <h2>Codigo de barras escaneado:</h2>
      {scannedCode ? (
        <div>
          <p>{scannedCode}</p>
        </div>
      ) : (
        <p>No se ha escaneado ningún código aún.</p>
      )}
    </div>
  );
};

export default Camera;
