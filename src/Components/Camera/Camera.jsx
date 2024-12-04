import React, { useEffect, useRef, useState } from "react";

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false); // Para manejar permisos
  const [videoError, setVideoError] = useState(false); // Manejo de errores de video
  const videoRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Solicitar acceso a la cámara
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Asignar la transmisión al videoRef
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Asegurarse de que la transmisión comienza correctamente
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play(); // Reproducir el video una vez cargado
          };
        }

        setHasPermission(true); // Permiso concedido
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        setVideoError(true); // Si ocurre un error, mostrar mensaje
        setHasPermission(false); // No se pudo acceder
      }
    };

    getCamera();

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
      {videoError && (
        <p>
          Error al acceder a la cámara. Asegúrese de haber concedido los
          permisos necesarios.
        </p>
      )}
      {hasPermission ? (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      ) : (
        <p>No se ha otorgado permiso para acceder a la cámara.</p>
      )}
    </div>
  );
};

export default Camera;
