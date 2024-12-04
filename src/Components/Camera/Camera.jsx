import React, { useEffect, useRef, useState } from "react";

const CameraComponent = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [images, setImages] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        setHasPermission(false);
      }
    };

    getCamera();

    const captureImage = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Asegurarse de que el canvas tenga las mismas dimensiones que el video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Generar imagen base64
        const imageUrl = canvas.toDataURL("image/png");

        // Guardar imagen
        setImages((prevImages) => [...prevImages, imageUrl]);
      }
    }, 10000); // Captura cada 10 segundos

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
            style={{ display: "none" }} // Ocultar video
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />{" "}
          {/* Ocultar canvas */}
          <h2>Imágenes Capturadas:</h2>
          <div>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Captured ${index}`}
                style={{
                  width: "200px",
                  margin: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
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

export default CameraComponent;
