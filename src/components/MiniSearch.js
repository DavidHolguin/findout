import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [user, setUser] = useState(null);
  const [typedUsername, setTypedUsername] = useState('');
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
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.username) {
      const typeUsername = async () => {
        for (let i = 0; i <= user.username.length; i++) {
          setTypedUsername(user.username.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };
      typeUsername();
    }
  }, [user]);

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
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      className="w-full max-w-2xl mx-auto text-left"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold mx-6 leading-8 text-[#09FDFD]"
      >
        {user?.username ? (
          <>
            ¡Hola, <span className="text-white">{typedUsername}</span>!
          </>
        ) : (
          "¡Hola, qué gusto verte!"
        )}
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
          className="w-full pl-12 pr-4 py-3 rounded-full border border-[#09FDFD] 
                    bg-white/70 backdrop-blur-md dark:bg-gray-800/70
                    focus:outline-none focus:ring-2 focus:ring-[#09FDFD]
                    placeholder-gray-400 dark:placeholder-gray-500
                    text-gray-900 dark:text-white
                    transition-all duration-300
                    font-system text-lg"
        />
        <SearchIcon 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" 
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