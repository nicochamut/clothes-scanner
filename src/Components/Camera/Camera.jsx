import React, { useEffect, useRef, useState } from "react";

const Camera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]); // Para almacenar los logs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const log = (message) => {
    // Añadir el mensaje al estado de logs
    setLogs((prevLogs) => [...prevLogs, message]);
  };

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
        log("Cámara accedida con éxito.");
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        setHasPermission(false);
        log("Error al acceder a la cámara.");
      }
    };

    getCamera();

    const captureImage = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Asegurarse de que el canvas tenga las mismas dimensiones que el video
        if (video.videoWidth && video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Generar imagen base64
          const imageUrl = canvas.toDataURL("image/png");
          log("Imagen capturada.");

          // Guardar imagen
          setImages((prevImages) => [...prevImages, imageUrl]);
        }
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
            style={{ width: "100%", border: "1px solid black" }} // Muestra el video en el navegador
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

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "2px solid #ccc",
          borderRadius: "5px",
          maxHeight: "200px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Console Log:</h3>
        <div>
          {logs.map((logMessage, index) => (
            <p key={index}>{logMessage}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Camera;
