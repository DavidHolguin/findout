import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, UserRoundPen, Trash2, Check } from 'lucide-react';

const ShoppingCartComponent = () => {
  // Obtener companyId de los parámetros de la URL
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState({ items: {}, company: null });
  const [includeUtensils, setIncludeUtensils] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setError('ID de compañía no válido');
      setIsLoading(false);
      return;
    }

    try {
      const loadCart = () => {
        const savedCartString = localStorage.getItem('shopping_cart');
        if (savedCartString) {
          const parsedCart = JSON.parse(savedCartString);
          // Verificamos si existe el carrito para esta compañía
          if (parsedCart && parsedCart[companyId]) {
            setCart({
              items: parsedCart[companyId].items || {},
              company: parsedCart[companyId].company || null
            });
          } else {
            setCart({ items: {}, company: null });
          }
        }
      };

      loadCart();
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setError('Error al cargar el carrito');
      setCart({ items: {}, company: null });
      setIsLoading(false);
    }
  }, [companyId]);

  const updateLocalStorage = useCallback((newCart) => {
    if (!companyId) return;
    
    try {
      const savedCartString = localStorage.getItem('shopping_cart');
      const savedCart = savedCartString ? JSON.parse(savedCartString) : {};
      
      savedCart[companyId] = {
        items: newCart.items,
        company: newCart.company || savedCart[companyId]?.company
      };
      
      localStorage.setItem('shopping_cart', JSON.stringify(savedCart));
    } catch (error) {
      console.error('Error updating localStorage:', error);
      setError('Error al actualizar el carrito');
    }
  }, [companyId]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        items: {
          ...prevCart.items,
          [productId]: {
            ...prevCart.items[productId],
            quantity
          }
        }
      };
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const newItems = { ...prevCart.items };
      delete newItems[productId];
      
      const newCart = {
        ...prevCart,
        items: newItems,
        company: Object.keys(newItems).length > 0 ? prevCart.company : null
      };
      
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  const clearCompanyCart = useCallback(() => {
    try {
      const savedCartString = localStorage.getItem('shopping_cart');
      if (savedCartString) {
        const savedCart = JSON.parse(savedCartString);
        delete savedCart[companyId];
        localStorage.setItem('shopping_cart', JSON.stringify(savedCart));
      }
      setCart({ items: {}, company: null });
      // Opcional: redirigir al usuario a la página principal después de vaciar el carrito
      navigate('/');
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Error al vaciar el carrito');
    }
  }, [companyId, navigate]);

  const getCartTotal = useCallback(() => {
    return Object.values(cart.items).reduce((total, item) => {
      return total + (parseFloat(item.final_price) * item.quantity);
    }, 0);
  }, [cart.items]);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  const cartItems = Object.values(cart.items || {});
  const subtotal = getCartTotal();
  const serviceCharge = 2.00;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + serviceCharge + tax;

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl">Tu carrito está vacío</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Agrega algunos productos para comenzar</p>
          <button
            onClick={() => navigate(`/company/${companyId}`)}
            className="mt-4 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen flex flex-col dark:text-white">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Mi Carrito</h1>
          <button
            onClick={() => navigate(`/company/${companyId}`)}
            className="text-cyan-400 hover:text-cyan-500"
          >
            Volver a la tienda
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {cart.company?.name || ""}
        </p>
      </div>
      
      <div className="flex-1 p-4">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 pb-4 border-b dark:border-gray-700 last:border-b-0">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <img 
                  src={item.image_url || "/api/placeholder/80/80"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/80/80";
                  }}
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
              
              <div className="flex items-center gap-4">
                {item.quantity === 1 ? (
                  <button 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    className="w-8 h-8 flex items-center justify-center text-cyan-400 border border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-white transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Reducir cantidad"
                  >
                    -
                  </button>
                )}
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center text-cyan-400 border border-cyan-400 rounded-full hover:bg-cyan-400 hover:text-white transition-colors"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center bg-cyan-400/10 px-3 py-1 rounded-full">
            <span className="mr-2">⏰</span>
            <span>45 min</span>
          </div>
          <button 
            className="flex items-center text-gray-600 dark:text-gray-400"
            onClick={() => setIncludeUtensils(!includeUtensils)}
          >
            <span>Incluir utensilios</span>
            <div className={`ml-2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${includeUtensils ? 'bg-cyan-400 border-cyan-400' : 'border-gray-300'}`}>
              {includeUtensils && <Check className="h-3 w-3 text-white" />}
            </div>
          </button>
        </div>

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

      <div className="p-4">
        <button 
          className="w-full bg-cyan-400 text-black dark:text-white py-4 rounded-xl font-medium flex items-center justify-center hover:bg-cyan-500 transition-colors group"
          onClick={() => console.log('Proceder al pago')}
        >
          <span>Negociar el domicilio</span>
          <div className="ml-2 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <UserRoundPen className="h-4 w-4" />
          </div>
        </button>
        
        <button
          onClick={clearCompanyCart}
          className="w-full mt-2 text-red-500 text-sm hover:text-red-600 transition-colors"
        >
          Vaciar carrito
        </button>
    
      </div>
    </div>
  );
};

export default ShoppingCartComponent;