import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Layers, AlertCircle } from 'lucide-react';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dc3vcn9g6/';

const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return '/api/placeholder/400/320';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${CLOUDINARY_BASE_URL}${imageUrl}`;
};

// Updated CategoryHeader to match slider style
const CategoryHeader = ({ category, companiesCount }) => {
  return (
    <div className="mb-3">
      <div className="relative  rounded-2xl overflow-hidden border-2 border-primary">
        <div className="flex h-full items-center justify-between p-4 bg-gradient-to-t from-primary/50 to-transparent via-transparent dark:bg-gradient-to-l dark:from-primary/80 dark:via-primary/20 dark:to-transparent">
          <div className="flex gap-6 items-center flex-row min-w-0 relative">
            <div className="flex flex-col">
              <h1 className="text-2xl text-[#4d4d4d] dark:text-gray-200 font-bold leading-6">
                {category?.name || 'Categoría'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-6">
                {companiesCount} {companiesCount === 1 ? 'empresa' : 'empresas'} disponibles
              </p>
            </div>
            
            
          </div>
          <div className="ml-8">
            {category?.image ? (
              <img
                src={getFullImageUrl(category.image)}
                alt={category.name}
                className="w-12 h-12 object-cover "
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center">
                <Layers className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Rest of the ImageFromS3, CompanyLogo, and CompanyCategory components remain the same
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
      <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-2 border-[#09FDFD] ${className}`}>
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

const CompanyCategory = () => {
  const { categoryId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const companiesResponse = await axios.get(
          `https://backendfindout-ea692e018a66.herokuapp.com/api/companies/?category=${categoryId}`,
          config
        );

        setCompanies(companiesResponse.data);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader category={category} companiesCount={companies.length} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
          >
            <Link to={`/company/${company.id}`} className="block">
              <div className="relative">
                <ImageFromS3
                  imageUrl={company.cover_photo_url}
                  alt={`${company.name} foto de portada`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CompanyLogo 
                  logo={company.profile_picture_url}
                  companyName={company.name}
                  className="absolute -bottom-6 left-4 w-16 h-16 border-4 transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{company.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCategory;