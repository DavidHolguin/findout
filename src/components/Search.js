import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MenuBar from './MenuBar';

// Custom hook para manejar la carga de imágenes con URLs prefirmadas
const usePresignedImage = (imageUrl, type, imageUrls, setImageUrls) => {
  const [currentUrl, setCurrentUrl] = useState(imageUrl);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageUrl || imageUrls[imageUrl]) {
        setCurrentUrl(imageUrls[imageUrl] || imageUrl);
        return;
      }

      try {
        const objectKey = imageUrl.includes('amazonaws.com')
          ? imageUrl.split('.com/').pop()
          : imageUrl;
          
        const presignedUrl = await getPresignedUrl(objectKey, type);

        if (presignedUrl) {
          setImageUrls(prev => ({
            ...prev,
            [imageUrl]: presignedUrl,
          }));
          setCurrentUrl(presignedUrl);
        }
      } catch (err) {
        console.error('Error loading presigned URL:', err);
        setError(true);
      }
    };

    loadImage();
  }, [imageUrl, type, imageUrls, setImageUrls]);

  return { currentUrl, error };
};

// Componente optimizado para manejo de imágenes
const ImageWithPresignedUrl = ({ imageUrl, alt, type, imageUrls, setImageUrls }) => {
  const { currentUrl, error } = usePresignedImage(imageUrl, type, imageUrls, setImageUrls);

  if (error) {
    return <img src="/path/to/placeholder-image.jpg" alt={alt} className="w-full h-48 object-cover rounded-md mb-2" />;
  }

  return (
    <img
      src={currentUrl}
      alt={alt}
      className="w-full h-48 object-cover rounded-md mb-2"
      onError={() => setError(true)}
    />
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageUrls, setImageUrls] = useState({});

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

        // Precargar URLs prefirmadas
        const companyImages = companiesResponse.data
          .filter(company => company.profile_picture)
          .map(company => loadPresignedUrl(company.profile_picture, 'companies'));

        const productImages = productsResponse.data
          .filter(product => product.image)
          .map(product => loadPresignedUrl(product.image, 'products'));

        await Promise.all([...companyImages, ...productImages]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.status === 403
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
      const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(lowercaseQuery) &&
        (selectedCategory === 'all' || company.category === selectedCategory)
      );
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredResults({ companies: filteredCompanies, products: filteredProducts });
    };

    filterResults();
  }, [query, companies, products, selectedCategory]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const renderCompanies = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredResults.companies.map(company => (
        <div key={company.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          {company.profile_picture && (
            <ImageWithPresignedUrl
              imageUrl={company.profile_picture}
              alt={company.name}
              type="companies"
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
            />
          )}
          <h3 className="text-xl font-semibold">{company.name}</h3>
          {company.description && (
            <p className="text-gray-600 leading-5">{company.description.slice(0, 100)}...</p>
          )}
          <Link to={`/company/${company.id}`} className="mt-2 inline-block text-blue-600 hover:underline">
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div>
      {categories.map(category => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          <div className="flex overflow-x-auto pb-4">
            {products.filter(product => product.category === category.id).map(product => (
              <div key={product.id} className="flex-none w-64 mr-4">
                <div className="border rounded-lg p-4">
                  {product.image && (
                    <ImageWithPresignedUrl
                      imageUrl={product.image}
                      alt={product.name}
                      type="products"
                      imageUrls={imageUrls}
                      setImageUrls={setImageUrls}
                    />
                  )}
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price}</p>
                  <Link to={`/product/${product.id}`} className="mt-2 inline-block text-blue-600 hover:underline">
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="container px-4 pb-12 mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 pb-12 mx-auto">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Buscar empresas, productos o servicios..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-6 flex w-full rounded-full overflow-hidden">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex-1 py-2 text-center ${activeTab === 'companies' ? 'bg-[#09FDFD] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Business
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-center ${activeTab === 'products' ? 'bg-[#09FDFD] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Products 
        </button>
      </div>

      {activeTab === 'companies' && (
        <>
          <div className="mb-4 flex flex-wrap justify-start">
            <button onClick={() => setSelectedCategory('all')} className={`py-1 px-4 mr-2 mb-2 ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
              Todas las categorías
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`py-1 px-4 mr-2 mb-2 ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {renderCompanies()}
        </>
      )}

      {activeTab === 'products' && renderProducts()}
    </div>
  );
};

export default Search;
