import React, { useState } from "react";
import QrReader from "react-qr-barcode-scanner";

const Camera = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [debugLog, setDebugLog] = useState(""); // Logs de depuración

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data.text); // Almacena el código escaneado
      setDebugLog(`Código detectado: ${data.text}`);
    }
  };

  const handleError = (err) => {
    setDebugLog(`Error: ${err}`);
  };

  return (
    <div>
      <h1>Escáner de Códigos de Barras / QR</h1>
      <QrReader
        delay={300} // Tiempo de retraso entre escaneos (en milisegundos)
        style={{ width: "100%" }}
        onScan={handleScan}
        onError={handleError}
      />

      <h2>Código escaneado:</h2>
      {scannedCode ? (
        <div>
          <p>{scannedCode}</p>
        </div>
      ) : (
        <p>No se ha escaneado ningún código aún.</p>
      )}

      <h2>Logs de depuración:</h2>
      <div
        style={{
          whiteSpace: "pre-wrap",
          marginTop: "20px",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {debugLog}
      </div>
    </div>
  );
};

export default Camera;
