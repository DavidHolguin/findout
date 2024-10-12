import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MenuBar from './MenuBar';

const Search = () => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/companies/');
        setCompanies(response.data);
        setFilteredCompanies(response.data); // Mostrar todas las empresas al inicio
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const results = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(results);
  }, [query, companies]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="container px-4 pb-12 mx-auto">
    
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar empresas..."
        className="w-full p-2 border rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {filteredCompanies.map(company => (
          <Link key={company.id} to={`/company/${company.id}`} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <img src={company.profile_picture} alt={company.name} className="w-full h-55 object-cover rounded-md mb-2" />
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <p className="text-gray-600 leading-5">{company.description.slice(0, 100)}...</p>
          </Link>
        ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default Search;

