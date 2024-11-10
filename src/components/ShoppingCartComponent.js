import React from 'react';
import { Plus, Check } from 'lucide-react';

const ShoppingCartComponent = ({ companyId = '11' }) => {
  // Simulando el shopping_cart que mencionaste
  const shopping_cart = {
    "11": {
      "items": {
        "8": {
          "id": 8,
          "name": "BURGUER BUCAROS",
          "price": "18.50",
          "final_price": "18.50",
          "image_url": "http://res.cloudinary.com/dc3vcn9g6/image/upload/v1729200330/products/kc3jt3rrpyrmdgzgedrz.jpg",
          "quantity": 1,
          "active_promotions": []
        }
      },
      "company": {
        "id": 11,
        "name": "BUMANGUES"
      }
    }
  };

  // Obtener los datos del carrito específico
  const currentCart = shopping_cart[companyId] || { items: {}, company: { name: 'Mi Tienda Local' } };
  const cartItems = Object.values(currentCart.items || {});
  const company = currentCart.company;

  // Funciones de manejo del carrito
  const updateQuantity = (itemId, newQuantity) => {
    // Implementar la lógica de actualización
    console.log('Actualizar cantidad:', itemId, newQuantity);
  };

  const removeFromCart = (itemId) => {
    // Implementar la lógica de eliminación
    console.log('Eliminar item:', itemId);
  };

  const clearCompanyCart = () => {
    // Implementar la lógica de limpieza
    console.log('Limpiar carrito');
  };

  // Cálculos de totales
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.final_price) * item.quantity);
    }, 0);
  };

  const subtotal = getCartTotal();
  const serviceCharge = 2.00;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + serviceCharge + tax;

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl">Tu carrito está vacío</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Agrega algunos productos para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen flex flex-col dark:text-white">
      {/* Restaurant Name */}
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-medium">MyCarrito</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {company.name}
        </p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 pb-4 border-b dark:border-gray-700 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img 
                  src={item.image_url || "/api/placeholder/80/80"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    ${parseFloat(item.final_price).toFixed(2)}
                  </p>
                  {item.active_promotions && item.active_promotions.length > 0 && (
                    <p className="text-cyan-400 text-xs mt-1">
                      ¡Promoción activa!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  className="text-cyan-400 font-bold"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <div>{item.quantity}</div>
                <button 
                  className="w-6 h-6 border rounded-md dark:border-gray-700"
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    } else {
                      removeFromCart(item.id);
                    }
                  }}
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Info */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center bg-cyan-400/10 px-3 py-1 rounded-full">
            <span className="mr-2">⏰</span>
            <span>45 min</span>
          </div>
          <div className="flex items-center">
            <span>Incluir utensilios</span>
            <Check className="ml-2 text-cyan-400" />
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tarifa servicio</span>
            <span>${serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Tienda</span>
          <span>Carrito</span>
          <span>Pago</span>
          <span>Recogida</span>
        </div>
        <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded">
          <div className="absolute left-0 top-0 h-full w-1/2 bg-cyan-400 rounded"></div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4">
        <button className="w-full bg-cyan-400 text-black dark:text-white py-4 rounded-xl font-medium flex items-center justify-center hover:bg-cyan-500 transition-colors">
          <span>Proceder al pago</span>
          <Plus className="ml-2 h-5 w-5" />
        </button>
        <button
          onClick={clearCompanyCart}
          className="w-full mt-2 text-red-500 text-sm"
        >
          Vaciar carrito
        </button>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
          Estoy listo, quiero hacer al pago
        </p>
      </div>
    </div>
  );
};

export default ShoppingCartComponent;