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
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-500 ease-out
        ${isOpen 
          ? 'bg-black/25 backdrop-blur-sm' 
          : 'bg-transparent backdrop-blur-none'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white w-full max-w-md rounded-t-3xl overflow-hidden shadow-xl
          transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform
          ${isOpen 
            ? 'translate-y-0 scale-100 opacity-100' 
            : 'translate-y-24 scale-95 opacity-0'}`}
        onTransitionEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full 
              shadow-lg text-gray-500 transition-all duration-300 
              hover:bg-white hover:shadow-xl hover:text-gray-700
              group-hover:translate-y-1"
          >
            <ChevronDown 
              size={24}
              className="transition-transform duration-300 group-hover:scale-110" 
            />
          </button>
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={product.image_url || "/api/placeholder/400/320"} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 
                hover:scale-110"
            />
          </div>
        </div>
        
        <div className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2 transition-transform duration-300 
            hover:translate-x-2">{product.name}</h2>
          <p className="text-green-600 font-bold text-xl mb-2">${product.price}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-cyan-400 text-white py-3 rounded-full font-bold
              transition-all duration-300 transform
              hover:bg-cyan-500 hover:shadow-lg hover:scale-105 
              active:scale-95 active:bg-cyan-600"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;