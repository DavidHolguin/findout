import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#09FDFD] dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 z-50 font-['Poppins',sans-serif] transition-all duration-500 ease-in-out ${
        showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="w-full flex justify-center">
          <Link to="/">
            <img
              src="/logoFindout.webp"
              alt="Logo"
              className="h-6 object-contain dark:filter dark:brightness-110"
            />
          </Link>
        </div>
        <div className="absolute right-6 flex items-center gap-2">
          {user ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="text-sm hidden sm:block">Cerrar sesión</span>
              <FaSignOutAlt className="text-2xl" />
            </button>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="text-sm hidden sm:block">Iniciar sesión</span>
              <FaSignInAlt className="text-2xl" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;