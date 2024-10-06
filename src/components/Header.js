import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link to="/" className="text-2xl font-bold">Marketplace PWA</Link>
        <div>
          <Link to="/search" className="mr-4">Buscar</Link>
          <Link to="/login">Iniciar Sesión</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;