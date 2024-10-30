import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Settings } from 'lucide-react';

const MenuBar = () => {
  const location = useLocation();

  // Return null if we're on the register-business page
  if (location.pathname === '/register-business') {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex justify-around pt-2 pb-4 shadow-md transition-colors duration-200">
      <Link 
        to="/" 
        className={`flex flex-col items-center ${
          isActive('/') 
            ? 'text-cyan-400 dark:text-cyan-300' 
            : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300'
        } transition`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/search" 
        className={`flex flex-col items-center ${
          isActive('/search') 
            ? 'text-cyan-400 dark:text-cyan-300' 
            : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300'
        } transition`}
      >
        <Search size={24} />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center ${
          isActive('/profile') 
            ? 'text-cyan-400 dark:text-cyan-300' 
            : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300'
        } transition`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={`flex flex-col items-center ${
          isActive('/settings') 
            ? 'text-cyan-400 dark:text-cyan-300' 
            : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300'
        } transition`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  );
};

export default MenuBar;