import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Camera = () => {
  useEffect(() => {
    // Configurar el escáner de código QR
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10, // Frames por segundo para el escaneo
        qrbox: 250, // Tamaño de la caja de escaneo
      },
      false
    );

    // Iniciar el escáner
    scanner.render(
      (qrCodeMessage) => {
        console.log(`Código QR detectado: ${qrCodeMessage}`);
      },
      (errorMessage) => {
        console.log(`Error: ${errorMessage}`);
      }
    );

    return () => {
      // Detener el escáner al desmontar el componente
      scanner.clear();
    };
  }, []);

  return (
    <div>
      <h1>Escáner de Códigos QR</h1>
      <div id="qr-reader" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default Camera;
