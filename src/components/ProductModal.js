import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-end justify-center transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white bg-opacity-80 backdrop-blur-lg w-full max-w-md rounded-t-3xl overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transitionProperty: 'transform, opacity',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTransitionEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-gray-700 transition-all duration-300 hover:translate-y-1 hover:shadow-lg"
          >
            <ChevronDown size={24} />
          </button>
          <img 
            src={product.image_url || "/api/placeholder/400/320"} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-green-600 font-bold text-xl mb-2">${product.price}</p>
          <p className="text-gray-600 mb-6 leading-5">{product.description}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-cyan-400 text-white py-3 rounded-full font-bold hover:bg-cyan-500 transition-all duration-300 hover:shadow-md"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;