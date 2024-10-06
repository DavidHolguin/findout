// src/components/CompanyDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyAndProducts = async () => {
      const companyResponse = await axios.get(`http://localhost:8000/api/companies/${id}/`);
      setCompany(companyResponse.data);
      
      const productsResponse = await axios.get(`http://localhost:8000/api/products/?company=${id}`);
      setProducts(productsResponse.data);
    };
    fetchCompanyAndProducts();
  }, [id]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
  };

  if (!company) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto mt-8">
      <img src={company.cover_photo} alt={company.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h2 className="text-3xl font-bold mb-2">{company.name}</h2>
      <p className="text-gray-600 mb-4">{company.description}</p>
      <div className="mb-4">
        <strong>Teléfono:</strong> {company.phone}
      </div>
      <div className="mb-4">
        <strong>Dirección:</strong> {company.address}
      </div>
      
      <h3 className="text-2xl font-bold mt-8 mb-4">Productos y Servicios</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-2" />
            <h4 className="text-xl font-semibold">{product.name}</h4>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDetail;