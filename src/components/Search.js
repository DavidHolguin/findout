import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Package, Search as SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Hook personalizado para detectar la dirección del scroll
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 10);
      
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && 
          (Math.abs(scrollY - lastScrollY) > 10)) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return { scrollDirection, isAtTop };
};

const CompanyLogo = ({ logo, companyName }) => {
  const [error, setError] = useState(false);

  if (error || !logo) {
    return (
      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#09FDFD] z-10">
        <span className="text-xl font-bold text-gray-500 font-system">
          {companyName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={`${companyName} logo`}
      className="absolute top-4 right-4 w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg z-10"
      onError={() => setError(true)}
    />
  );
};

const ImageFromS3 = ({ imageUrl, alt }) => {
  const [error, setError] = useState(false);

  if (error || !imageUrl) {
    return <img src="/api/placeholder/400/320" alt={alt} className="w-full h-48 object-cover rounded-t-lg" />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-48 object-cover rounded-t-lg"
      onError={() => setError(true)}
    />
  );
};

const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === products.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? products.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-48">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageFromS3
            imageUrl={product.image_url}
            alt={product.name}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <p className="text-sm font-medium font-system truncate">{product.name}</p>
            <p className="text-xs font-system">{product.price}</p>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const Search = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ companies: [], products: [] });
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const searchContainerRef = useRef(null);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const shouldShowSearch = scrollDirection === "up" || isAtTop;

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

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [companiesResponse, productsResponse, categoriesResponse] = await Promise.all([
          axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/companies/', config),
          axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/products/', config),
          axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/categories/', config),
        ]);

        setCompanies(companiesResponse.data);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError(
          error.response?.status === 403
            ? 'No tienes permiso para acceder a esta información. Por favor, inicia sesión o contacta al administrador.'
            : 'Ha ocurrido un error al cargar los datos. Por favor, intenta de nuevo más tarde.'
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterResults = () => {
      const lowercaseQuery = query.toLowerCase();

      let filteredCompanies = companies.filter(company => {
        const matchingProducts = products.filter(product =>
          product.company === company.id &&
          (product.name.toLowerCase().includes(lowercaseQuery) ||
           company.name.toLowerCase().includes(lowercaseQuery)) &&
          (selectedCategories.length === 0 || selectedCategories.includes(product.category))
        );

        return matchingProducts.length > 0 || (
          company.name.toLowerCase().includes(lowercaseQuery) &&
          selectedCategories.length === 0
        );
      });

      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) &&
        (selectedCategories.length === 0 || selectedCategories.includes(product.category))
      );

      setFilteredResults({ companies: filteredCompanies, products: filteredProducts });
    };

    filterResults();
  }, [query, companies, products, selectedCategories]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleInputHover = (isHovered) => {
    setIsInputHovered(isHovered);
    if (isHovered) {
      setPlaceholderText(SearchCategories[currentCategoryIndex]);
    }
  };

  const renderCompanies = () => {
    const getMatchingProducts = (company) => {
      return products.filter(product =>
        product.company === company.id &&
        (selectedCategories.length === 0 || selectedCategories.includes(product.category))
      );
    };
  
    const filteredCompaniesWithProducts = filteredResults.companies
      .map(company => ({
        ...company,
        matchingProducts: getMatchingProducts(company)
      }))
      .filter(company =>
        selectedCategories.length === 0 || company.matchingProducts.length > 0
      );
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCompaniesWithProducts.map(company => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
          >
            <ImageFromS3
              imageUrl={company.cover_photo_url}
              alt={`${company.name} cover photo`}
            />
            
            <CompanyLogo 
              logo={company.profile_picture_url}
              companyName={company.name}
            />
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 font-system">{company.name}</h3>
              {company.description && (
                <p className="text-gray-600 leading-5 mb-4 font-system">{company.description.slice(0, 100)}...</p>
              )}
              
              {selectedCategories.length > 0 && company.matchingProducts.length > 0 && (
                <ProductCarousel products={company.matchingProducts} />
              )}
              
              <Link 
                to={`/company/${company.id}`}
                className="mt-4 inline-block text-[#09FDFD] hover:text-[#00d8d8] transition-colors duration-300 font-system"
              >
                Go to 
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredResults.products.map(product => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
        >
          <ImageFromS3
            imageUrl={product.image_url}
            alt={product.name}
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold font-system">{product.name}</h3>
            <p className="text-gray-600 font-system">{product.price}</p>
            <Link 
              to={`/product/${product.id}`}
              className="mt-2 inline-block text-[#09FDFD] hover:text-[#00d8d8] transition-colors duration-300 font-system"
            >
              Ver producto
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md font-system"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {shouldShowSearch && (
          <motion.div 
            ref={searchContainerRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50"
            style={{ top: '60px' }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={placeholderText}
                      onMouseEnter={() => handleInputHover(true)}
                      onMouseLeave={() => handleInputHover(false)}
                      className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 
                                bg-white/70 backdrop-blur-md shadow-lg
                                focus:outline-none focus:ring-2 focus:ring-[#09FDFD]
                                placeholder-gray-400 transition-all duration-300
                                font-system"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('companies')}
                    className={`p-3 rounded-full transition-all duration-300 font-system ${
                      activeTab === 'companies'
                        ? 'bg-[#09FDFD] text-white shadow-lg'
                        : 'bg-white/70 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('products')}
                    className={`p-3 rounded-full transition-all duration-300 font-system ${
                      activeTab === 'products'
                        ? 'bg-[#09FDFD] text-white shadow-lg'
                        : 'bg-white/70 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Package size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Categorías */}
              <div className="mt-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {categories.map(category => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`
                        py-1 px-4 rounded-full whitespace-nowrap text-sm font-system
                        ${selectedCategories.includes(category.id)
                          ? 'bg-[#09FDFD] text-white shadow-md'
                          : 'bg-white/70 text-gray-600 hover:bg-gray-100'
                        }
                        border border-gray-200 backdrop-blur-sm transition-all duration-300
                      `}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Efecto de degradado para el overflow */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor Principal */}
      <div 
        className="container mx-auto px-4" 
        style={{ 
          marginTop: shouldShowSearch ? '200px' : '80px',
          transition: 'margin-top 0.3s ease-in-out'
        }}
      >
        {/* Cuadrícula de Resultados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'companies' && renderCompanies()}
          {activeTab === 'products' && renderProducts()}

          {/* Mensaje de No Resultados */}
          {((activeTab === 'companies' && filteredResults.companies.length === 0) ||
            (activeTab === 'products' && filteredResults.products.length === 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg font-system">
                No se encontraron resultados para tu búsqueda.
                {selectedCategories.length > 0 && " Prueba ajustando los filtros de categoría."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Estilos personalizados para ocultar la barra de desplazamiento */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Definición de la fuente del sistema */
        .font-system {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
                       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                       sans-serif;
        }
        
        /* Aplicar la fuente del sistema globalmente */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
                       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                       sans-serif;
        }
      `}</style>
    </>
  );
};

export default Search;