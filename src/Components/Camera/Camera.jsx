import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const CameraComponent = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [debugLog, setDebugLog] = useState(""); // Estado para los logs
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
        setDebugLog(`Código detectado: ${code.data}`); // Mostrar log de éxito
        setScannedCode(code.data); // Almacenar el código escaneado
      } else {
        setDebugLog("No se detectó ningún código"); // Mostrar log si no se detecta nada
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleScan();
    }, 5000); // Escanea cada 10 segundos

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

      <h2>Código de barras escaneado:</h2>
      {scannedCode ? (
        <div>
          <p>{scannedCode}</p>
        </div>
      ) : (
        <p>No se ha escaneado ningún código aún.</p>
      )}

      <h2>Logs de depuración:</h2>
      <div
        style={{
          whiteSpace: "pre-wrap",
          marginTop: "20px",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {debugLog} {/* Mostrar los logs aquí */}
      </div>
    </div>
  );
};

export default CameraComponent;
