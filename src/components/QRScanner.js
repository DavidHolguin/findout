import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showScanner, setShowScanner] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, []);

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    setShowScanner(false);
  };

  const onScanError = (error) => {
    console.warn(error);
  };

  const handlePaymentCheck = async (url) => {
    setLoading(true);
    try {
      // Extraer el ID del pedido de la URL
      const orderId = url.split('/').pop();
      
      // Hacer la petición a tu backend
      const response = await fetch(`/api/payment-status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setPaymentStatus(data.status);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setPaymentStatus(null);
    setShowScanner(true);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {showScanner ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Escanear QR</h2>
            <div id="reader" className="w-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Resultado del escaneo</h2>
              <button 
                onClick={resetScanner}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg break-all">
              {scanResult}
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={scanResult}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700"
              >
                Abrir URL
              </a>
              
              <button
                onClick={() => handlePaymentCheck(scanResult)}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Verificar estado del pago'}
              </button>
            </div>

            {paymentStatus && (
              <div className={`p-4 rounded-lg ${
                paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Estado del pago: {paymentStatus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;