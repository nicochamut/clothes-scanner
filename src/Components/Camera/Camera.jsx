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

    console.log("Intentando inicializar el escáner...");

    const qrReaderElement = document.getElementById("qr-reader");

    if (qrReaderElement) {
      console.log("Elemento encontrado, inicializando escáner.");
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

          if (!qrCodeMessage) {
            console.warn("Código QR vacío o inválido detectado.");
            return;
          }

          setQrCode(qrCodeMessage); // Guardamos el código detectado
          searchProduct(Number(qrCodeMessage)); // Llamamos a la búsqueda del producto
        },
        (errorMessage) => {
          console.log(`Error al escanear: ${errorMessage}`);
        }
      );
    } else {
      console.error("Elemento con id=qr-reader no encontrado en el DOM.");
    }

    return () => {
      if (scanner.current) {
        console.log("Limpiando escáner...");
        scanner.current.clear();
      }
    };
  }, []);

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

  // Función para manejar el cambio en el input manual
  const handleCodigoManualChange = (e) => {
    setCodigoManual(e.target.value);
  };

  // Función para manejar el evento al presionar "Enter" en el input
  const handleManualSubmit = (e) => {
    if (e.key === "Enter" || !e.key) {
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
            onChange={handleCodigoManualChange}
            onKeyPress={handleManualSubmit}
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
