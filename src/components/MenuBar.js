import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, User, Settings } from 'lucide-react';

const MenuBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 flex justify-around pt-2 pb-4 shadow-md">
      <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link to="/search" className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Search size={24} />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link to="/settings" className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  );
};

export default MenuBar;