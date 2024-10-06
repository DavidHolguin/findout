import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axios.get('http://localhost:8000/api/companies/');
      setCompanies(response.data);
    };
    fetchCompanies();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {companies.map(company => (
          <Link key={company.id} to={`/company/${company.id}`} className="bg-white shadow-md rounded-lg p-4">
            <img src={company.profile_picture} alt={company.name} className="w-full h-40 object-cover rounded-md mb-2" />
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <p className="text-gray-600">{company.description.slice(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
