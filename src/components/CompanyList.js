import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from './MenuBar';
import { Link } from 'react-router-dom';
import TopBurgers from './TopBurguers';
import Slider from './Slider';
import BannerSection from './BannerSection';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/companies/');
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
    <div className="container mx-auto mt-10 px-3 font-system">
      <Slider />
      <div className="my-8"> {/* Añadido margen vertical */}
        <TopBurgers />
      </div>
      <BannerSection />
      <MenuBar />
    </div>
  );
};

export default CompanyList;