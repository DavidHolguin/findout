import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Layers, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageFromS3 = ({ imageUrl, alt }) => {
  const [error, setError] = useState(false);

  if (error || !imageUrl) {
    return <img src="/api/placeholder/400/320" alt={alt} className="w-full h-48 object-cover rounded-lg" />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-48 object-cover rounded-lg"
      onError={() => setError(true)}
    />
  );
};

const CompanyLogo = ({ logo, companyName = '', className = "" }) => {
  const [error, setError] = useState(false);

  if (error || !logo) {
    return (
      <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-2 border-[#09fdfd] ${className}`}>
        <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
          {companyName ? companyName.charAt(0).toUpperCase() : '?'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={`Logo de ${companyName || 'la empresa'}`}
      className={`w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-lg ${className}`}
      onError={() => setError(true)}
    />
  );
};

const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === products.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-xs">${product.price}</p>
          </div>
        </div>
      ))}
      {products.length > 1 && (
        <>
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
        </>
      )}
    </div>
  );
};

const CategoryHeader = ({ category, companiesCount }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-3">
      <div className="flex gap-1">
        <div className="rounded-xl flex items-center justify-center border-2 border-[#09fdfd] bg-white dark:bg-gray-900">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-colors"
            aria-label="Volver atrás"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" fill="none" viewBox="0 0 17 21">
                <path fill="#0FF" d="M8.349 10.5c.736.784 1.456 1.543 2.175 2.302 2.04 2.165 4.07 4.321 6.119 6.486.313.339.457.71.254 1.139-.195.42-.576.573-1.041.573-1.913 0-3.825-.008-5.738 0-.39 0-.694-.145-.948-.42a6489.84 6489.84 0 0 0-7.135-7.568c-.567-.606-1.142-1.204-1.7-1.81-.44-.468-.45-.952-.01-1.413L9.188.388A1.18 1.18 0 0 1 10.084 0h5.806c.448 0 .82.153 1.015.557.195.412.076.792-.237 1.123-2.64 2.803-5.29 5.605-7.93 8.4-.127.13-.245.258-.389.42Z"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 rounded-lg border-2 border-[#09fdfd] bg-white dark:bg-gray-900 dark:bg-gradient-to-l dark:from-primary/80 dark:via-primary/20 dark:to-transparent">
          <div className="flex h-full items-center justify-between items-center p-1 px-3">
            <div className="flex flex-col">
              <h1 className="text-xl text-[#4d4d4d] dark:text-gray-200 font-bold leading-4">
                {category?.name || 'Fast Food'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-4">
                {companiesCount} {companiesCount === 1 ? 'lugar encontrado' : 'lugares encontrados'}
              </p>
            </div>
            <div className="ml-8">
              {category?.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#09fdfd]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyCategory = () => {
  const { categoryId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [companiesResponse, productsResponse] = await Promise.all([
          axios.get(
            `https://backendfindout-ea692e018a66.herokuapp.com/api/companies/?category=${categoryId}`,
            config
          ),
          axios.get(
            'https://backendfindout-ea692e018a66.herokuapp.com/api/marketplace/products/',
            config
          )
        ]);

        setCompanies(companiesResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError(
          error.response?.status === 403
            ? 'No tienes permiso para acceder a esta información. Por favor, inicia sesión o contacta al administrador.'
            : 'Ha ocurrido un error al cargar los datos. Por favor, intenta de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const isBusinessOpen = (businessHours) => {
    if (!businessHours) return null;

    const now = new Date();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = daysOfWeek[now.getDay()];
    const currentHours = businessHours[currentDay];

    if (!currentHours || !currentHours.open || !currentHours.close) return null;

    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    const isOpen = currentTime >= currentHours.open && currentTime <= currentHours.close;

    return {
      isOpen,
      openTime: formatTime(currentHours.open),
      closeTime: formatTime(currentHours.close)
    };
  };

  const getCompanyProducts = (companyId) => {
    return products.filter(product => product.company === companyId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#09fdfd]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg shadow-md flex items-center"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 mr-3" />
          <span className="block sm:inline">{error}</span>
        </motion.div>
      </div>
    );
  }

  const category = companies[0]?.category;

  return (
    <div className="container mx-auto px-4 py-4">
      <CategoryHeader category={category} companiesCount={companies.length} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => {
          const businessStatus = isBusinessOpen(company.business_hours);
          const companyProducts = getCompanyProducts(company.id);
          
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative overflow-hidden rounded-xl border-2 border-[#09fdfd] hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 ${
                businessStatus && !businessStatus.isOpen ? 'opacity-60' : ''
              }`}
            >
              <Link to={`/company/${company.id}`}>
                <div className="relative">
                  {companyProducts.length > 0 ? (
                    <ProductCarousel products={companyProducts} />
                  ) : (
                    <ImageFromS3
                      imageUrl={company.cover_photo_url}
                      alt={`${company.name} foto de portada`}
                    />
                  )}
                  <CompanyLogo 
                    logo={company.profile_picture_url}
                    companyName={company.name}
                    className="absolute -bottom-6 left-4 w-16 h-16 border-4 transform hover:scale-110 transition-transform duration-300"
                  />
                  {company.business_hours && businessStatus && (
                    <div className="absolute top-2 left-2 min-w-[130px]">
                      <div className={`
                        rounded-full text-sm font-bold shadow-lg
                        ${businessStatus.isOpen 
                          ? 'bg-gradient-to-r from-[#09fdfd] to-cyan-300 text-white' 
                          : 'bg-gradient-to-r from-red-500 to-red-400 text-white'}
                      `}>
                        <div className="flex items-center">
                          <span className={`
                            px-3 py-1 rounded-full
                            ${businessStatus.isOpen ? 'bg-[#09fdfd]' : 'bg-red-600'}
                          `}>
                            {businessStatus.isOpen ? 'ABIERTO' : 'CERRADO'}
                          </span>
                          <span className="px-2 whitespace-nowrap">
                            {businessStatus.isOpen 
                              ? `HASTA ${businessStatus.closeTime}`
                              : `ABRE ${businessStatus.openTime}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{company.description}</p>
                  {companyProducts.length > 0 && (
                    <p className="text-sm text-[#09fdfd] mt-2">
                      {companyProducts.length} producto{companyProducts.length !== 1 ? 's' : ''} disponible{companyProducts.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default CompanyCategory;