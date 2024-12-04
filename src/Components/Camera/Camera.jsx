import React, { useEffect, useRef, useState } from "react";

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false); // Para manejar permisos
  const videoRef = useRef(null);

  useEffect(() => {
    // Solicitar acceso a la cámara
    const getCamera = async () => {
      try {
        // Acceder a la cámara
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Asignar la transmisión al videoRef para mostrar en el componente
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setHasPermission(true); // Si se obtuvo acceso, actualizar el estado
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        setHasPermission(false); // Si hay error (por ejemplo, sin permisos)
      }
    };

    getCamera();

    // Limpiar la transmisión cuando el componente se desmonte
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // Detener la transmisión
        }
      }
    };
  }, []);

  return (
    <div>
      <h1>Cámara del dispositivo</h1>
      {hasPermission ? (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      ) : (
        <p>No se ha otorgado permiso para acceder a la cámara.</p>
      )}
    </div>
  );
};

export default Camera;
