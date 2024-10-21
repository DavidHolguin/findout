import React from 'react';
import { X } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-lg z-50 flex items-end justify-center">
      <div 
        className="bg-white bg-opacity-80 backdrop-blur-lg w-full max-w-md rounded-t-3xl overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out"
        style={{
          animation: isOpen ? 'slideUp 0.3s ease-out forwards' : 'slideDown 0.3s ease-in forwards'
        }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <img 
            src={product.image_url || "/api/placeholder/400/320"} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-green-600 font-bold text-xl mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-cyan-400 text-white py-3 rounded-full font-bold hover:bg-cyan-500 transition duration-300"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;