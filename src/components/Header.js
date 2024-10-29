import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaStore, FaShoppingCart, FaUserAlt, FaCog, FaSignOutAlt, FaFire } from 'react-icons/fa';
import { RiMenLine, RiWomenLine, RiRestaurantLine, RiShieldLine } from 'react-icons/ri';
import { BiWine } from 'react-icons/bi';
import axios from 'axios';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = 'https://backendfindout-ea692e018a66.herokuapp.com/api/login/';

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const config = {
          headers: {
            'Authorization': `Token ${token}`
          }
        };

        const response = await axios.get(API_URL, config);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        localStorage.removeItem('token');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full bg-[#09FDFD] dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 z-50 font-['Poppins',sans-serif] transition-all duration-500 ease-in-out ${
          showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-gray-800"></div>
              <div className="w-6 h-0.5 bg-gray-800"></div>
              <div className="w-6 h-0.5 bg-gray-800"></div>
            </div>
          </button>
          
          <div className="flex justify-center flex-1">
            <Link to="/">
              <img
                src="/logoFindout.webp"
                alt="Logo"
                className="h-6 object-contain dark:filter dark:brightness-110"
              />
            </Link>
          </div>

          <div className="w-6"> {/* Empty div for spacing */}
            <Link to="/cart" className="text-gray-800">
              <FaShoppingCart className="w-6 h-6" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="text-lg font-medium">Hola, {user?.username || 'Fabian'}</div>
          
          <Link to="/register-business" className="inline-block">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2">
              <span>Unirme a Findout</span>
              <span className="text-[#09FDFD]">♥</span>
            </button>
          </Link>

          <Link to="/orders" className="flex items-center space-x-2 text-gray-700">
            <FaShoppingCart className="w-5 h-5" />
            <span>Ver mi pedido</span>
          </Link>

          <div className="pt-4">
            <div className="text-lg font-medium mb-4">Descubre</div>
            <div className="space-y-4">
              <Link to="/trending" className="flex items-center space-x-2 text-gray-700">
                <FaFire className="w-5 h-5 text-orange-500" />
                <span>Tendencia</span>
              </Link>
              
              <Link to="/for-him" className="flex items-center space-x-2 text-gray-700">
                <RiMenLine className="w-5 h-5" />
                <span>Para ellos</span>
              </Link>
              
              <Link to="/for-her" className="flex items-center space-x-2 text-gray-700">
                <RiWomenLine className="w-5 h-5" />
                <span>Para ellas</span>
              </Link>
              
              <Link to="/restaurants" className="flex items-center space-x-2 text-gray-700">
                <RiRestaurantLine className="w-5 h-5" />
                <span>Restaurantes</span>
              </Link>
              
              <Link to="/insurance" className="flex items-center space-x-2 text-gray-700">
                <RiShieldLine className="w-5 h-5" />
                <span>Seguros</span>
              </Link>
              
              <Link to="/entertainment" className="flex items-center space-x-2 text-gray-700">
                <BiWine className="w-5 h-5" />
                <span>Pasar el rato</span>
              </Link>
            </div>
          </div>

          <Link to="/download" className="inline-block">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2">
              <span>Descargar App</span>
              <span>↓</span>
            </button>
          </Link>

          <div className="pt-4 space-y-4">
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700">
              <FaUserAlt className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
            
            <Link to="/settings" className="flex items-center space-x-2 text-gray-700">
              <FaCog className="w-5 h-5" />
              <span>Configuración</span>
            </Link>
            
            <button onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }} className="flex items-center space-x-2 text-gray-700">
              <FaSignOutAlt className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Header;