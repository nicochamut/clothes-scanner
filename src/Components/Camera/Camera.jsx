import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import ProductDetails from "../ProductDetails/ProductDetails";

const Camera = () => {
  const [qrCode, setQrCode] = useState(null); // Código QR detectado
  const [product, setProduct] = useState(null); // Producto encontrado en JSON
  const [codigoManual, setCodigoManual] = useState(""); // Código ingresado manualmente
  const [jsonData, setJsonData] = useState([]); // Datos cargados del JSON

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

    // Iniciar el escáner de código QR
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (qrCodeMessage) => {
        setQrCode(qrCodeMessage); // Actualizar el estado con el código QR detectado
        searchProduct(qrCodeMessage); // Buscar en el JSON el producto correspondiente
      },
      (errorMessage) => {
        console.log(`Error: ${errorMessage}`);
      }
    );

    return () => {
      scanner.clear(); // Detener el escáner al desmontar el componente
    };
  }, []);

  // Función para buscar el producto en el archivo JSON
  const searchProduct = (code) => {
    console.log("Código buscado:", code);

    // Asegurar que ambos valores sean números y compararlos
    const foundProduct = jsonData.find(
      (item) => Number(item.codebar) === Number(code)
    );

    if (foundProduct) {
      setProduct(foundProduct); // Si se encuentra el producto, lo guardamos
    } else {
      setProduct(null); // Si no se encuentra el producto
      console.log("No se encontró el producto");
    }
  };

  // Función para manejar el cambio en el input manual
  const handleCodigoManualChange = (e) => {
    setCodigoManual(e.target.value);
  };

  // Función para manejar el evento al presionar "Enter" en el input
  const handleManualSubmit = (e) => {
    if (e.key === "Enter") {
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
      {/* Solo mostramos ProductDetails cuando se haya encontrado un producto */}
      {product ? (
        <div>
          <ProductDetails product={product} />

          {/* Botón para volver a escanear */}
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

          {/* Área para escanear QR */}
          <div id="qr-reader" style={{ width: "100%", height: "400px" }}></div>

          {/* Campo de entrada para código manual */}
          <input
            type="text"
            value={codigoManual}
            onChange={handleCodigoManualChange}
            onKeyPress={handleManualSubmit} // Ejecutar la búsqueda al presionar "Enter"
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
