import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  Flame,
  Store,
  Wine,
  Shield,
  MenuSquare,
  Download,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    onClose();
  };

  const handleCategorySearch = (category) => {
    navigate(`/search?category=${category}`);
    onClose();
  };

  const categories = [
    { 
      name: 'Tendencia', 
      icon: <Flame className="w-5 h-5 text-orange-500" />, 
      path: 'trending' 
    },
    { 
      name: 'Para ellos', 
      icon: <User className="w-5 h-5 text-blue-500" />, 
      path: 'for-him' 
    },
    { 
      name: 'Para ellas', 
      icon: <User className="w-5 h-5 text-pink-500" />, 
      path: 'for-her' 
    },
    { 
      name: 'Restaurantes', 
      icon: <MenuSquare className="w-5 h-5 text-red-500" />, 
      path: 'restaurants' 
    },
    { 
      name: 'Seguros', 
      icon: <Shield className="w-5 h-5 text-green-500" />, 
      path: 'insurance' 
    },
    { 
      name: 'Pasar el rato', 
      icon: <Wine className="w-5 h-5 text-purple-500" />, 
      path: 'entertainment' 
    }
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white
          shadow-lg`}
      >
        <div className="p-6 space-y-6">
          {/* User and Theme Toggle Section */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">
              Hola, {user?.username || 'Invitado'}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Join Findout Button */}
          <Link to="/register-business" className="inline-block" onClick={onClose}>
            <button className="bg-gray-900 dark:bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 hover:opacity-90 transition-all">
              <Store className="w-4 h-4" />
              <span>Unirme a Findout</span>
              <Heart className="w-4 h-4 text-primary dark:text-pink-300" />
            </button>
          </Link>

          {/* Orders Link */}
          <Link 
            to="/orders" 
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
            onClick={onClose}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Ver mi pedido</span>
          </Link>

          {/* Categories Section */}
          <div className="pt-4">
            <div className="text-lg font-medium mb-4">Descubre</div>
            <div className="space-y-4">
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => handleCategorySearch(category.path)}
                  className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download App Button */}
          <Link to="/download" className="inline-block" onClick={onClose}>
            <button className="bg-primary dark:bg-primary-dark text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 hover:opacity-90 transition-all">
              <Download className="w-4 h-4" />
              <span>Descargar App</span>
            </button>
          </Link>

          {/* Settings Section */}
          <div className="pt-4 space-y-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={onClose}
            >
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={onClose}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-2 w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileMenu;