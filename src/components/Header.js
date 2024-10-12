import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#09FDFD] shadow-md font-['Poppins',sans-serif]">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <img 
            src="/logoFindout.webp" 
            alt="Logo" 
            className="mr-3 h-8 object-contain" // Ajusta el tamaño del logo si es necesario
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="px-5 py-2.5 text-sm font-medium text-[#09FDFD] bg-white rounded-md hover:bg-gray-100 transition-colors duration-300 ease-in-out"
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
