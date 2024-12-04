import React, { useRef, useEffect, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true }) // Solicita acceso a la cámara
      .then((stream) => {
        setHasPermission(true); // Permiso concedido
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Muestra la cámara
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
            style={{
              width: "100%",
              maxWidth: "600px",
              border: "2px solid black",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Camera;
