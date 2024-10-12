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
    <div className="flex flex-col items-center font-poppins">
      <section className="w-11/12 mb-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-cyan-400 rounded-full flex items-center justify-center">
            <img src={company.cover_photo} alt={company.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-gray-600 text-2xl font-extrabold">{company.name}</h3>
            <a href="#" className="text-sm text-gray-600">Fast Food Restaurante</a>
          </div>
        </div>

        <div className="w-full mt-6 flex justify-between">
          <div className="text-center">
            <h3 className="text-green-600 text-xl">OPEN NOW</h3>   
            <p className="text-sm">Hasta <span id="horaCierre">11:50 pm</span></p>
            <a id="openPopup" href="#" className="flex items-center justify-center mt-4 text-cyan-400">
              <span>{company.address}</span>
              <svg id="svg10654" height="40" viewBox="0 0 6.35 6.35" width="40" className="ml-2">
                <path d="m2.258 291.96502a.2646.2646 0 0 0 -.174.46871l1.619 1.38699-1.619 1.38648a.2646.2646 0 1 0 .344.40049l1.854-1.58595a.2646.2646 0 0 0 0-.40256l-1.854-1.5875a.2646.2646 0 0 0 -.169-.0667z" />
              </svg>
            </a>
          </div>

          <div className="w-2/3 border-l border-gray-400 pl-4">
            <p className="text-sm text-gray-600">{company.description}</p>
            <a id="escribirBoton" href="#" className="mt-4 flex items-center bg-cyan-400 text-white font-bold text-sm px-3 py-2 rounded-full">
              <svg id="Icons" height="15" viewBox="0 0 60 60" width="15" className="mr-2">
                <path d="m28.473 54.271 3.945-4.486-2.431-.964z" />
              </svg>
              Escribir
            </a>
          </div>
        </div>
      </section>

      <section className="w-11/12">
        <h3 className="text-center text-gray-600 font-bold text-xl mb-6">Productos y Servicios</h3>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold">{`$${product.price}`}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-cyan-400 text-white font-bold py-2 rounded hover:bg-cyan-500 transition duration-200"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CompanyDetail;
