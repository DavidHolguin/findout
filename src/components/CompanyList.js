import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from './MenuBar';
import { Link } from 'react-router-dom';
import TopBurgers from './TopBurguers';
import Slider from './Slider';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/companies/');
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const results = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(results);
  }, [searchTerm, companies]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto mt-4 px-3 font-['Poppins',sans-serif]">
      <Slider />
      <TopBurgers />
      <input
        type="text"
        placeholder="Buscar empresas..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full h-[45px] rounded-md outline-none border-b-2 border-[#09FDFD] px-3 bg-white shadow-inner shadow-gray-300 text-[#121c23] transition-all duration-300 ease-in-out placeholder-[#9a9a9a] hover:bg-gray-100 focus:bg-gray-200 focus:border focus:border-[#2d2d2d] focus:border-b-2 focus:border-b-[#09FDFD] mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCompanies.map(company => (
          <Link key={company.id} to={`/company/${company.id}`} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <img src={company.profile_picture} alt={company.name} className="w-full h-40 object-cover rounded-md mb-2" />
            <h3 className="text-xl font-semibold text-[#121c23]">{company.name}</h3>
            <p className="text-gray-600">{company.description.slice(0, 100)}...</p>
          </Link>
        ))}
      </div>
      <MenuBar />
    </div>
  );
};

export default CompanyList;