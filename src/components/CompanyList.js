import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from './MenuBar';
import { Link } from 'react-router-dom';
import TopBurgers from './TopBurguers';
import Slider from './Slider';
import PersonalizedCategorySlider from './PersonalizedCategorySlider';

import MiniSearch from './MiniSearch';


const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://findoutpwa-966440893d7b.herokuapp.com/api/companies/');
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
    <div className="container mx-auto px-3 font-system">
      <div className=" mb-2"> {/* Añadido margen vertical */}
      <MiniSearch />
      </div>
      
      <Slider />
      
        <PersonalizedCategorySlider />
   
      
      <div className="my-4"> {/* Añadido margen vertical */}
        <TopBurgers />
      </div>
      
      <MenuBar />
    </div>
  );
};

export default CompanyList;