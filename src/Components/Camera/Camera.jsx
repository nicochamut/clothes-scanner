import React, { useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment", // Usar cámara trasera
          width: { ideal: 1280 }, // Resolución ideal
          height: { ideal: 720 }, // Resolución ideal
        },
      })
      .then((stream) => {
        setHasPermission(true); // Permiso concedido
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Asignar el flujo al video
        }
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara. Verifica los permisos.");
      });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <h1
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          zIndex: 10,
        }}
      >
        Acceso a la Cámara
      </h1>
      {!hasPermission ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <p style={{ color: "white" }}>
            Para usar esta aplicación, necesitamos acceso a tu cámara.
          </p>
          <button onClick={requestCameraAccess}>Conceder Permisos</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover", // Esto asegura que el video ocupe toda la pantalla sin deformarse
            backgroundColor: "black",
            zIndex: -1, // Coloca el video detrás del contenido
          }}
        />
      )}
    </div>
  );
};

export default Camera;
