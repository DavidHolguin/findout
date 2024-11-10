// hooks/useShoppingCart.js
import { useState, useEffect } from 'react';

export const useShoppingCart = (companyId) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Create a new cart object
      const newCart = { ...prevCart };
      
      // Initialize company cart if it doesn't exist
      if (!newCart[companyId]) {
        newCart[companyId] = {
          items: {},
          company: {
            id: product.company,
            name: product.company_name || 'Company'
          }
        };
      }

      // Get current company cart
      const companyCart = newCart[companyId];

      // Update or add product
      if (companyCart.items[product.id]) {
        companyCart.items[product.id] = {
          ...companyCart.items[product.id],
          quantity: companyCart.items[product.id].quantity + quantity
        };
      } else {
        companyCart.items[product.id] = {
          id: product.id,
          name: product.name,
          price: product.price,
          final_price: product.final_price,
          image_url: product.image_url,
          quantity: quantity,
          active_promotions: product.active_promotions || []
        };
      }

      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[companyId]?.items[productId]) {
        delete newCart[companyId].items[productId];
        // Remove company entry if no items left
        if (Object.keys(newCart[companyId].items).length === 0) {
          delete newCart[companyId];
        }
      }
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[companyId]?.items[productId]) {
        newCart[companyId].items[productId].quantity = quantity;
      }
      return newCart;
    });
  };

  const getCompanyCart = () => {
    return cart[companyId] || { items: {} };
  };

  const clearCompanyCart = () => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[companyId];
      return newCart;
    });
  };

  const getCartTotal = () => {
    const companyCart = getCompanyCart();
    return Object.values(companyCart.items).reduce((total, item) => {
      return total + (parseFloat(item.final_price) * item.quantity);
    }, 0);
  };

  return {
    cart: getCompanyCart(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCompanyCart,
    getCartTotal
  };
};

