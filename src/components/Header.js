import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingBag, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  const API_URL = 'https://backendfindout-ea692e018a66.herokuapp.com/api/login/';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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
        className={`fixed top-0 left-0 w-full bg-primary dark:bg-gray-900 shadow-md dark:shadow-gray-900/50 z-50 font-['Poppins',sans-serif] transition-all duration-500 ease-in-out ${
          showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-white hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Logo */}
          <div className="flex justify-center flex-1">
            <Link to="/" className="relative">
              <img
                src="/logoFindout.webp"
                alt="Logo"
                className="h-6 object-contain dark:brightness-110 transition-all"
              />
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-800 dark:text-white hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </nav>

        {/* Progress bar indicator */}
        <div className="h-0.5 bg-gradient-to-r from-primary-dark to-primary dark:from-gray-800 dark:to-gray-700" />
      </header>

      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        user={user}
      />
    </>
  );
};

export default Header;