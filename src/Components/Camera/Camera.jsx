import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import ProductDetails from "../ProductDetails/ProductDetails";

const Camera = () => {
  const [qrCode, setQrCode] = useState(null); // Código QR detectado
  const [product, setProduct] = useState(null); // Producto encontrado en JSON
  const [codigoManual, setCodigoManual] = useState(""); // Código ingresado manualmente
  const [jsonData, setJsonData] = useState([]); // Datos cargados del JSON
  const scanner = useRef(null); // Referencia al escáner para controlar su instancia

  // Función para cargar el JSON
  useEffect(() => {
    const loadJsonData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Error en la respuesta de la red");
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
      }
    };

    loadJsonData();
  }, []);

  // Función para inicializar el escáner
  const startScanner = () => {
    if (scanner.current) return; // Evitar múltiples inicializaciones
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
        setCodigoManual(qrCodeMessage); // Actualizar el estado con el código detectado
      },
      (errorMessage) => {
        console.log(`Error al escanear: ${errorMessage}`);
      }
    );
  };

  // Inicializar el escáner al montar
  useEffect(() => {
    startScanner();
    return () => {
      if (scanner.current) {
        scanner.current.clear();
        scanner.current = null;
      }
    };
  }, []);

  // Efecto para manejar la búsqueda automática al cambiar el código manual
  useEffect(() => {
    if (codigoManual) searchProduct(codigoManual);
  }, [codigoManual]);

  // Función para buscar un producto
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

  // Función para reiniciar el escáner y la vista
  const handleBackToScanner = () => {
    setProduct(null); // Limpiar el producto encontrado
    setQrCode(null); // Limpiar el código QR detectado
    setCodigoManual(null); // Limpiar el código manual
    startScanner(); // Reactivar el escáner
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

          <div id="qr-reader" style={{ width: "100%", height: "400px" }}></div>

          <input
            type="text"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            // onKeyPress={(e) => e.key === "Enter" && searchProduct(codigoManual)}
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
