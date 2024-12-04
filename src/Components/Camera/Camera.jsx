import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Camera = () => {
  // Estado para almacenar el código detectado
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    // Iniciar el escáner de código QR
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10, // Fotogramas por segundo
        qrbox: 250, // Tamaño de la caja de escaneo
      },
      false
    );

    // Configurar la función de éxito (cuando se detecta un código)
    scanner.render(
      (qrCodeMessage) => {
        console.log(`Código QR detectado: ${qrCodeMessage}`);
        setQrCode(qrCodeMessage); // Actualizar el estado con el código detectado
      },
      (errorMessage) => {
        console.log(`Error: ${errorMessage}`);
      }
    );

    return () => {
      // Detener el escáner cuando el componente se desmonta
      scanner.clear();
    };
  }, []);

  return (
    <div>
      <h1>Escáner de Códigos QR</h1>
      <div id="qr-reader" style={{ width: "100%", height: "400px" }}></div>

      {qrCode && (
        <div style={{ marginTop: "20px", fontSize: "18px", color: "green" }}>
          <strong>Código QR detectado:</strong> {qrCode}
        </div>
      )}
    </div>
  );
};

export default Camera;
