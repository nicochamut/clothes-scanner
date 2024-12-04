import React from "react";
import Webcam from "react-webcam";

const Camera = () => {
  return (
    <div>
      <h1>Cámara del dispositivo</h1>
      {/* Componente Webcam para mostrar el video */}
      <Webcam
        audio={false} // Desactiva el audio si no lo necesitas
        videoConstraints={{
          facingMode: "environment", // Para acceder a la cámara trasera (útil en dispositivos móviles)
        }}
        screenshotFormat="image/jpeg" // Formato de imagen al capturar una foto
        width="100%" // Para que el video ocupe el 100% del ancho disponible
      />
    </div>
  );
};

export default Camera;
