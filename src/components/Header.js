import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = 'https://findoutpwa-966440893d7b.herokuapp.com/api/login/';

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

  const handleCartClick = (e) => {
    e.preventDefault();
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const companyIds = Object.keys(cart);
      if (companyIds.length > 0) {
        navigate(`/cart/${companyIds[0]}`);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full bg-slate-900 dark:bg-gray-900 shadow-md dark:shadow-gray-900/50 z-50 font-['Poppins',sans-serif] transition-all duration-500 ease-in-out ${
          showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center h-16 px-6">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-white hover:opacity-80 transition-opacity focus:outline-none"
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

          {/* Cart */}
          <button 
            onClick={handleCartClick}
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
        </nav>

        {/* Progress bar indicator */}
        <div className="h-0.5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-gray-800 dark:to-gray-700" />
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