import React, { useEffect, useRef, useState } from "react";

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false); // Para manejar permisos
  const [images, setImages] = useState([]); // Para almacenar las imágenes capturadas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        }

        setHasPermission(true); // Permiso concedido
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        setHasPermission(false); // No se pudo acceder
      }
    };

    getCamera();

    // Capturar una imagen cada 10 segundos
    const captureImage = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Establecer el tamaño del canvas al tamaño del video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Dibujar el frame actual del video en el canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convertir el canvas a una imagen en formato base64
        const imageUrl = canvas.toDataURL("image/png");

        // Almacenar la imagen capturada en el estado
        setImages((prevImages) => [...prevImages, imageUrl]);
      }
    }, 10000); // Captura cada 10 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(captureImage);
  }, []);

  return (
    <div>
      <h1>Cámara del dispositivo</h1>
      {hasPermission ? (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%"
            height="auto"
            style={{ display: "none" }} // Esconder el video en vivo
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />{" "}
          {/* Canvas oculto */}
          <h2>Imágenes Capturadas:</h2>
          <div>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Captured ${index}`}
                width="200"
                height="auto"
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No se ha otorgado permiso para acceder a la cámara.</p>
      )}
    </div>
  );
};

export default Camera;
