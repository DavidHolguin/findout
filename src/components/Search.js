import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MenuBar from './MenuBar';

const Search = () => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ companies: [], products: [], categories: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('authToken'); // Asumiendo que guardas el token en localStorage
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [companiesResponse, productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/companies/', config),
          axios.get('http://localhost:8000/api/products/', config),
          axios.get('http://localhost:8000/api/categories/', config)
        ]);

        setCompanies(companiesResponse.data);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 403) {
          setError('No tienes permiso para acceder a esta información. Por favor, inicia sesión o contacta al administrador.');
        } else {
          setError('Ha ocurrido un error al cargar los datos. Por favor, intenta de nuevo más tarde.');
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterResults = () => {
      const lowercaseQuery = query.toLowerCase();
      setFilteredResults({
        companies: companies.filter(company => company.name.toLowerCase().includes(lowercaseQuery)),
        products: products.filter(product => product.name.toLowerCase().includes(lowercaseQuery)),
        categories: categories.filter(category => category.name.toLowerCase().includes(lowercaseQuery))
      });
    };
    filterResults();
  }, [query, companies, products, categories]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  if (error) {
    return (
      <div className="container px-4 pb-12 mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <MenuBar />
      </div>
    );
  }

  return (
    <div className="container px-4 pb-12 mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar empresas, productos o categorías..."
        className="w-full p-2 border rounded mb-4"
      />
      
      {['companies', 'products', 'categories'].map((section) => (
        <div key={section}>
          <h2 className="text-2xl font-bold mt-6 mb-3 capitalize">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredResults[section].map(item => (
              <Link key={item.id} to={`/${section.slice(0, -1)}/${item.id}`} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                {item.profile_picture && (
                  <img src={item.profile_picture} alt={item.name} className="w-full h-48 object-cover rounded-md mb-2" />
                )}
                <h3 className="text-xl font-semibold">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 leading-5">{item.description.slice(0, 100)}...</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
      
      <MenuBar />
    </div>
  );
};

export default Search;