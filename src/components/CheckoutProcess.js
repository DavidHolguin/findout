import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ShoppingBag, MapPin, CreditCard, Check, ChevronLeft } from 'lucide-react';

const CheckoutProcess = () => {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    latitude: null,
    longitude: null,
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    
    // Calcular total
    const cartTotal = savedCart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    setTotal(cartTotal);
  }, []);

  const handleAddressSelect = async (address) => {
    try {
      // Usar un servicio de geocodificación para obtener lat/lng
      const response = await fetch(`/api/geocode/?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      setDeliveryAddress({
        address: address,
        latitude: data.latitude,
        longitude: data.longitude
      });
    } catch (error) {
      alert("No se pudo obtener la ubicación");
    }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          notes: item.notes
        })),
        delivery_address: deliveryAddress.address,
        delivery_latitude: deliveryAddress.latitude,
        delivery_longitude: deliveryAddress.longitude,
        payment_method: paymentMethod,
        total_amount: total
      };

      const response = await fetch('/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Error al crear el pedido');

      const data = await response.json();

      // Limpiar carrito
      localStorage.removeItem('cart');
      setCart([]);

      // Mostrar mensaje de éxito
      alert(`¡Pedido creado exitosamente! Tu número de pedido es: ${data.order_id}`);

      // Redirigir a la página de seguimiento
      window.location.href = `/orders/${data.order_id}/track`;

    } catch (error) {
      alert("No se pudo crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <ShoppingBag className="w-6 h-6 mr-2" />
          <span>Resumen</span>
        </div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <MapPin className="w-6 h-6 mr-2" />
          <span>Dirección</span>
        </div>
        <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <CreditCard className="w-6 h-6 mr-2" />
          <span>Pago</span>
        </div>
      </div>

      {/* Step 1: Cart Summary */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              onClick={() => setStep(2)}
              disabled={cart.length === 0}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Delivery Address */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Dirección de Entrega</h2>
          <input
            type="text"
            placeholder="Ingresa tu dirección"
            value={deliveryAddress.address}
            onChange={(e) => handleAddressSelect(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          />
          
          {deliveryAddress.latitude && deliveryAddress.longitude && (
            <div className="h-64 mb-4">
              <MapContainer
                center={[deliveryAddress.latitude, deliveryAddress.longitude]}
                zoom={15}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[deliveryAddress.latitude, deliveryAddress.longitude]}>
                  <Popup>Tu ubicación de entrega</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="w-4 h-4 inline mr-2" />
              Atrás
            </button>
            <button 
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              onClick={() => setStep(3)}
              disabled={!deliveryAddress.latitude || !deliveryAddress.longitude}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Method */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
          <div className="space-y-4">
            {/* Payment options */}
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('CASH')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'CASH' ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'CASH' && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <span>Efectivo</span>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('CARD')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'CARD' ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'CARD' && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <span>Tarjeta de Crédito/Débito</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 mt-6">
              <button 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="w-4 h-4 inline mr-2" />
                Atrás
              </button>
              <button 
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                onClick={createOrder}
                disabled={!paymentMethod || loading}
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProcess;