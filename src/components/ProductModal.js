import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      setIsAnimating(true);
      // Retrasamos la aparición del contenido hasta que el modal esté casi desplegado
      timeout = setTimeout(() => setContentVisible(true), 400);
    } else {
      setContentVisible(false);
      timeout = setTimeout(() => setIsAnimating(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end justify-center
        ${isOpen 
          ? 'animate-in fade-in duration-700' 
          : 'animate-out fade-out duration-500'
        }`}
      onClick={onClose}
    >
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm
        ${isOpen 
          ? 'animate-in fade-in duration-700' 
          : 'animate-out fade-out duration-500'
        }`}
      />

      <div 
        className={`relative bg-white w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl
          ${isOpen 
            ? 'animate-modal-open' 
            : 'animate-modal-close'
          }`}
        style={{
          animation: isOpen 
            ? 'modal-open 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : 'modal-close 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full 
              shadow-lg text-gray-500 hover:text-gray-700 transition-all duration-300 
              hover:rotate-180 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronDown size={24} />
          </button>
          
          <div className="overflow-hidden">
            <img 
              src={product.image_url || "/api/placeholder/400/320"} 
              alt={product.name} 
              className={`w-full h-auto object-cover transition-all duration-1000
                ${contentVisible ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            />
          </div>
        </div>

        <div className={`p-6 space-y-4 transition-all duration-500
          ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-green-600 font-bold text-xl">${product.price}</p>
          <p className="text-gray-600 leading-5">{product.description}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-cyan-400 text-white py-3 rounded-full font-bold
              transition-all duration-300 
              hover:bg-cyan-500 hover:shadow-lg hover:scale-105 
              active:scale-95 active:shadow-inner"
          >
            Agregar al carrito
          </button>
        </div>

        <style jsx>{`
          @keyframes modal-open {
            0% {
              transform: translateY(100%) scale(0.8);
              opacity: 0;
            }
            40% {
              transform: translateY(-4%) scale(1.02);
              opacity: 1;
            }
            70% {
              transform: translateY(2%) scale(0.99);
            }
            100% {
              transform: translateY(0) scale(1);
            }
          }

          @keyframes modal-close {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            30% {
              transform: translateY(2%) scale(0.99);
              opacity: 1;
            }
            100% {
              transform: translateY(100%) scale(0.8);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductModal;