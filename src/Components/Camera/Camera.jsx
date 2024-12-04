import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import ProductDetails from "../ProductDetails/ProductDetails";

const Camera = () => {
  const [qrCode, setQrCode] = useState(null); // Código QR detectado
  const [product, setProduct] = useState(null); // Producto encontrado en JSON
  const [codigoManual, setCodigoManual] = useState(""); // Código ingresado manualmente
  const [jsonData, setJsonData] = useState([]); // Datos cargados del JSON
  const qrReaderRef = useRef(null); // Referencia al contenedor del escáner
  const scanner = useRef(null); // Referencia al escáner para controlar su instancia

  useEffect(() => {
    // Cargar el archivo data.json desde la carpeta public
    const loadJsonData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Error en la respuesta de la red");
        }
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
      }
    };

    loadJsonData(); // Llamada a la función para cargar el JSON

    // Inicializar el escáner
    scanner.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.current.render(
      (qrCodeMessage) => {
        console.log("Código QR detectado:", qrCodeMessage);
        if (qrCodeMessage) {
          setCodigoManual(qrCodeMessage); // Actualizar el estado con el código detectado
        }
      },
      (errorMessage) => {
        console.log(`Error al escanear: ${errorMessage}`);
      }
    );

    return () => {
      if (scanner.current) {
        scanner.current.clear();
      }
    };
  }, []);

  // Buscar el producto automáticamente cuando el código manual cambia
  useEffect(() => {
    if (codigoManual) {
      handleManualSubmit(); // Llamar a la función de búsqueda cuando se actualiza el código
      setCodigoManual(null);
    }
  }, [codigoManual]);

  // Función para buscar el producto en el archivo JSON
  const searchProduct = (code) => {
    console.log("Buscando producto para el código:", code);

    const foundProduct = jsonData.find(
      (item) => Number(item.codebar) === Number(code)
    );

    if (foundProduct) {
      console.log("Producto encontrado:", foundProduct);
      setProduct(foundProduct);
    } else {
      console.log("No se encontró el producto para el código:", code);
      setProduct(null);
    }
  };

  // Función para manejar la búsqueda manual y automática
  const handleManualSubmit = () => {
    if (codigoManual) {
      searchProduct(codigoManual); // Buscar el producto con el código manual
      setCodigoManual(""); // Limpiar el input después de la búsqueda
    }
  };

  // Función para reiniciar la vista y volver al escáner
  const handleBackToScanner = () => {
    setProduct(null); // Limpiar el producto encontrado
    setQrCode(null); // Limpiar el código QR detectado
  };

  return (
    <div>
      {product ? (
        <div>
          <ProductDetails product={product} />

          <button
            onClick={handleBackToScanner}
            style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
          >
            Volver a escanear
          </button>
        </div>
      ) : (
        <div>
          <h1>Escáner de Códigos QR o Ingreso Manual</h1>

          <div
            id="qr-reader"
            ref={qrReaderRef}
            style={{ width: "100%", height: "400px" }}
          ></div>

          <input
            type="text"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
            placeholder="Ingrese el código del producto"
            style={{ marginTop: "20px", padding: "8px", fontSize: "16px" }}
          />

          {qrCode && (
            <div
              style={{ marginTop: "20px", fontSize: "18px", color: "green" }}
            >
              <strong>Código QR detectado:</strong> {qrCode}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Camera;
