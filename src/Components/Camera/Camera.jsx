import React, { useRef, useEffect, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  const requestCameraAccess = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("El navegador no soporta acceso a la cámara.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment", // Forzar cámara trasera
          width: { ideal: 1280 }, // Resolución ideal
          height: { ideal: 720 }, // Resolución ideal
        },
      })
      .then((stream) => {
        console.log("Stream recibido:", stream); // Verifica el flujo
        setHasPermission(true); // Permiso concedido
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Establece el flujo de la cámara
        }
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara. Verifica los permisos.");
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Acceso a la Cámara</h1>
      {!hasPermission ? (
        <>
          <p>Para usar esta aplicación, necesitamos acceso a tu cámara.</p>
          <button onClick={requestCameraAccess}>Conceder Permisos</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onLoadedMetadata={() => console.log("Video metadata loaded")} // Asegúrate de que el video se haya cargado
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "600px",
              border: "2px solid black",
              borderRadius: "8px",
              backgroundColor: "black", // Asegura que no haya un fondo blanco
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Camera;
