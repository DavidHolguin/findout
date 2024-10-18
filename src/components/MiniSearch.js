import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SearchCategories = [
  "Quizá un hot dog...",
  "Quizá una barbería...",
  "Encuentra negocios locales...",
  "Descubre productos...",
  "Quizá una hamburguesa...",
  "Encuentra artículos...",
  "Explora restaurantes...",
  "Busca servicios..."
];

const MiniSearch = () => {
  const [query, setQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const animatePlaceholder = async () => {
      if (isInputHovered) return;

      const currentCategory = SearchCategories[currentCategoryIndex];
      
      if (isTyping) {
        for (let i = 0; i <= currentCategory.length; i++) {
          if (isInputHovered) break;
          setPlaceholderText(currentCategory.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        setIsTyping(false);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera más tiempo antes de borrar
        for (let i = currentCategory.length; i >= 0; i--) {
          if (isInputHovered) break;
          setPlaceholderText(currentCategory.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        setIsTyping(true);
        setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % SearchCategories.length);
      }
    };

    animatePlaceholder();
  }, [isTyping, currentCategoryIndex, isInputHovered]);

  const handleInputHover = (isHovered) => {
    setIsInputHovered(isHovered);
    if (isHovered) {
      setPlaceholderText(SearchCategories[currentCategoryIndex]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto text-left "
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold mx-6 leading-8 text-[#09FDFD]"
      >
        ¡Hola, qué gusto verte!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl mb-2 mx-6 text-gray-400"
      >
        ¿Qué buscas hoy?
      </motion.p>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderText}
          onMouseEnter={() => handleInputHover(true)}
          onMouseLeave={() => handleInputHover(false)}
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 
                    bg-white/70 backdrop-blur-md 
                    focus:outline-none focus:ring-2 focus:ring-[#09FDFD]
                    placeholder-gray-400 transition-all duration-300
                    font-system text-lg"
        />
        <SearchIcon 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={24}
        />
      </form>

      <style>{`
        .font-system {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
                       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                       sans-serif;
        }
      `}</style>
    </motion.div>
  );
};

export default MiniSearch;