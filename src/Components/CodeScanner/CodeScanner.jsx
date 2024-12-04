import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const CodeScanner = () => {
  const [data, setData] = useState("No result");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Escáner de Código de Barras</h1>
      {/* Aquí se incluye el componente que abre la cámara */}
      <BarcodeScannerComponent
        width={500} // Ancho del área del escáner
        height={500} // Alto del área del escáner
        constraints={{ facingMode: "environment" }} // Configura la cámara trasera
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text); // Guarda el código detectado
          } else {
            setData("No result");
          }
        }}
      />
      <p>
        <strong>Resultado:</strong> {data}
      </p>
    </div>
  );
};

export default CodeScanner;
