import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll hacia abajo y más de 100px del top, ocultar Header
        setShowHeader(false);
      } else {
        // Scroll hacia arriba o menos de 100px del top, mostrar Header
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#09FDFD] shadow-md z-50 font-['Poppins',sans-serif] transition-transform duration-500 ease-in-out ${
        showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="w-full flex justify-center">
          <img
            src="/logoFindout.webp"
            alt="Logo"
            className="h-6 object-contain"
          />
        </div>
        <div className="absolute right-6">
          <Link to="/login" className="text-white text-3xl">
            <FaUserCircle className="text-3xl" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
