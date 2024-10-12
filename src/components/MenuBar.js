import { Home, Search, ShoppingCart, User, Settings } from 'lucide-react';

const MenuBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 flex justify-around py-2 shadow-md">
      <button className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Search size={24} />
        <span className="text-xs mt-1">Search</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-600 hover:text-cyan-400 transition">
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  );
};

export default MenuBar;
