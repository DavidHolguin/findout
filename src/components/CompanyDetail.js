import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MenuBar from './MenuBar';

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState({});
  const carouselRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyAndProducts = async () => {
      try {
        // Obtener detalles de la empresa
        const companyResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/companies/${id}/`);
        setCompany(companyResponse.data);
        
        // Obtener productos específicos de esta empresa
        const productsResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/products/`);
        // Filtrar solo los productos que pertenecen a esta empresa
        const companyProducts = productsResponse.data.filter(product => product.company === parseInt(id));
        
        // Obtener categorías
        const categoriesResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/categories/`);
        const categoriesMap = categoriesResponse.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoriesMap);
        
        // Agrupar productos por categoría
        const grouped = companyProducts.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});
        
        setProductsByCategory(grouped);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchCompanyAndProducts();
  }, [id]);

  const startDragging = (e, category) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRefs.current[category].offsetLeft);
    setScrollLeft(carouselRefs.current[category].scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e, category) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRefs.current[category].offsetLeft;
    const walk = (x - startX) * 2;
    carouselRefs.current[category].scrollLeft = scrollLeft - walk;
  };

  const getCarouselProducts = (products) => {
    if (products.length <= 1) return products;
    if (products.length === 2) return [...products, products[0]]; // Solo duplicamos uno si hay dos productos
    return [...products, ...products, ...products]; // Triplicamos si hay más de 2 productos
  };

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
      {/* Sección del perfil de la empresa */}
      <section className="w-11/12 mb-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-cyan-400 rounded-full flex items-center justify-center">
            <img src={company.profile_picture} alt={company.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-gray-600 text-2xl font-extrabold">{company.name}</h3>
            <a href="#" className="text-sm text-gray-600">Fast Food Restaurante</a>
          </div>
        </div>

        <div className="w-full mt-6 flex justify-between">
          <div className="text-center">
            <h3 className="text-green-600 text-xl">OPEN NOW</h3>   
            <p className="text-sm">Hasta <span>11:50 pm</span></p>
            <a href="#" className="flex items-center justify-center mt-4 text-cyan-400">
              <span>{company.address}</span>
            </a>
          </div>

          <div className="w-2/3 border-l border-gray-400 pl-4">
            <p className="text-sm leading-4 text-gray-600">{company.description}</p>
            <a href="#" className="mt-4 flex items-center bg-cyan-400 text-white font-bold text-sm px-3 py-2 rounded-full">
              Escribir
            </a>
          </div>
        </div>
      </section>

      {/* Sección de productos por categoría */}
      <section className="w-11/12">
        <h3 className="text-center text-gray-600 font-bold text-xl mb-6">Nuestro Menú</h3>

        {Object.entries(productsByCategory).map(([categoryId, products]) => (
          <div key={categoryId} className="mb-8">
            <h4 className="text-lg font-bold mb-4 text-gray-700 px-4">{categories[categoryId] || 'Categoría'}</h4>
            <div 
              className="overflow-x-hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div
                ref={el => carouselRefs.current[categoryId] = el}
                className="flex gap-4 px-4 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onMouseDown={(e) => startDragging(e, categoryId)}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onMouseMove={(e) => onDrag(e, categoryId)}
              >
                {getCarouselProducts(products).map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex-none w-[65%] snap-start"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h4 className="text-lg font-semibold leading-4 mb-2">{product.name}</h4>
                        <p className="text-gray-600 text-sm leading-4 line-clamp-2">{product.description}</p>
                        <p className="text-green-600 font-bold mt-2">${product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
      <MenuBar />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CompanyDetail;