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

  const API_URL = 'https://findout-adf55aa841e8.herokuapp.com/api/login/';

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
      className="w-full max-w-2xl mx-auto mt-4 mb-4 text-start"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold ml-4"
      >
        {user?.username ? (
          <span className="dark:text-white text-neutral-700">
            ¡Hola,{' '}
            <span className="dark:text-[#09FDFD] text-slate-900">
              {typedUsername}
            </span>
            !
          </span>
        ) : (
          <span className="dark:text-white text-neutral-700">
            ¡Hola, <span className='dark:text-[#09FDFD] text-slate-900'>qué gusto verte!</span> 
          </span>
        )}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl md:text-2xl mb-2 text-gray-400 ml-4 font-medium"
      >
        ¿Qué buscas hoy?
      </motion.p>
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderText}
          onMouseEnter={() => handleInputHover(true)}
          onMouseLeave={() => handleInputHover(false)}
          className="w-full pl-14 pr-6 py-4 rounded-full border-2 
                    dark:border-[#09FDFD] border-[#09FDFD]
                    bg-white/70 backdrop-blur-md dark:bg-gray-800/70
                    focus:outline-none focus:ring-4 
                    dark:focus:ring-[#09FDFD]/30 focus:ring-slate-900/30
                    placeholder-gray-400 dark:placeholder-gray-500
                    text-gray-900 dark:text-white
                    transition-all duration-300
                    font-system text-lg md:text-xl
                    shadow-lg hover:shadow-xl"
        />
        <SearchIcon 
          className="absolute left-5 top-1/2 transform -translate-y-1/2 dark:text-[#09FDFD] text-slate-900" 
          size={28}
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