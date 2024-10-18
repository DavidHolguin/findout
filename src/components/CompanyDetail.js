import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MenuBar from './MenuBar';

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <img src="/api/placeholder/400/320" alt={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

const CategoryButton = ({ category, isSelected, onClick }) => (
  <button
    onClick={() => onClick(category.id)}
    className={`flex-shrink-0 px-4 py-2 mx-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      isSelected
        ? 'bg-cyan-400 text-white shadow-lg'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    } backdrop-filter backdrop-blur-lg bg-opacity-30 shadow-md`}
  >
    {category.name}
  </button>
);

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const carouselRefs = useRef({});
  const categoryCarouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyAndProducts = async () => {
      try {
        const companyResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/companies/${id}/`);
        setCompany(companyResponse.data);
        
        const productsResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/products/`);
        const companyProducts = productsResponse.data.filter(product => product.company === parseInt(id));
        
        const categoriesResponse = await axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/categories/`);
        
        const grouped = companyProducts.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});
        
        setProductsByCategory(grouped);
        
        // Filter categories to only those with products
        const categoriesWithProducts = categoriesResponse.data.filter(
          category => grouped[category.id]
        );
        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchCompanyAndProducts();
  }, [id]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProductsByCategory = selectedCategories.length === 0
    ? productsByCategory
    : Object.fromEntries(
        Object.entries(productsByCategory).filter(([categoryId]) => 
          selectedCategories.includes(parseInt(categoryId))
        )
      );

  const startDragging = (e, ref) => {
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e, ref) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const getCarouselProducts = (products) => {
    if (products.length <= 1) return products;
    if (products.length === 2) return products;
    return [...products, ...products, ...products];
  };

  if (!company) return <div>Cargando...</div>;

  return (
    <div className="flex flex-col items-center font-poppins">
      {/* Company profile section */}
      <section className="w-full mb-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin-slow" style={{
              backgroundImage: 'linear-gradient(0deg, #00ffff, #ff00ff, #ffff00, #00ffff)',
              backgroundSize: '100% 400%',
              animation: 'rotating 3s linear infinite, gradientRotate 12s linear infinite'
           
            }}></div>
            <ImageWithFallback 
              src={company.profile_picture_url} 
              alt={company.name} 
              className="w-[88px] h-[88px] absolute rounded-full object-cover border-4	border-inherit	border-solid	"
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-gray-600 text-2xl leading-4 font-extrabold">{company.name}</h3>
            <p className="text-cyan-400 text-base font-medium ">
              {company.category && typeof company.category === 'object' 
                ? company.category.name 
                : (company.category || 'Categoría de la empresa')}
            </p>
            <div 
              ref={categoryCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide mt-2 pb-4"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onMouseDown={(e) => startDragging(e, categoryCarouselRef)}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onMouseMove={(e) => onDrag(e, categoryCarouselRef)}
            >
              {categories.map(category => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.includes(category.id)}
                  onClick={toggleCategory}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-11/12 flex items-center	 justify-between">
          <div className="text-center">
            <h3 className="text-green-600 text-xl leading-4 font-bold">OPEN NOW</h3>   
            <p className="text-sm">Hasta <span>11:50 pm</span></p>
            <a href="#" className="flex items-center justify-center mt-2 leading-4 text-cyan-400">
              <span>{company.address}</span>
            </a>
          </div>

          <div className="w-2/3 border-l border-gray-400 pl-4">
            <p className="text-sm leading-4 text-gray-600 mb-4">{company.description}</p>
            <a href="#" className=" bg-cyan-400 text-white font-bold text-sm px-6 py-2 rounded-full">
              Escribir
            </a>
          </div>
        </div>
      </section>

      {/* Products by category section */}
      <section className="w-full">
        {Object.entries(filteredProductsByCategory).map(([categoryId, products]) => (
          <div key={categoryId} className="mb-0">
            <h4 className="text-lg font-bold mb-4 text-gray-700 px-4">
              {categories.find(cat => cat.id === parseInt(categoryId))?.name || 'Categoría'}
            </h4>
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
                onMouseDown={(e) => startDragging(e, carouselRefs.current[categoryId])}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onMouseMove={(e) => onDrag(e, carouselRefs.current[categoryId])}
              >
                {getCarouselProducts(products).map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex-none w-[65%] snap-start"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-40 object-cover"
                      />
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
        @keyframes rotating {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes gradientRotate {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .animate-spin-slow {
          animation: rotating 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CompanyDetail;