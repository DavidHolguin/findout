import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MenuBar from './MenuBar';
import ProductModal from './ProductModal';
import { Send, Instagram, Flame, MapPin, Facebook, MessageCircle } from 'lucide-react';
import BadgesSection from './BadgesSection';
import CompanyDetailSkeleton from './CompanyDetailSkeleton';
import { useUserTracking } from '../hooks/useUserTracking';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up`}>
      {message}
    </div>
  );
};

// Toast Hook
const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return { toast, showToast, hideToast };
};

// Shopping Cart Hook
const useShoppingCart = (companyId) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      return parsedCart[companyId] || { items: {}, company: null };
    }
    return { items: {}, company: null };
  });

  const updateLocalStorage = useCallback((newCart) => {
    const savedCart = JSON.parse(localStorage.getItem('shopping_cart') || '{}');
    savedCart[companyId] = newCart;
    localStorage.setItem('shopping_cart', JSON.stringify(savedCart));
  }, [companyId]);

  const addToCart = useCallback((product, company) => {
    setCart(prevCart => {
      const existingItem = prevCart.items[product.id];
      const newCart = {
        items: {
          ...prevCart.items,
          [product.id]: {
            id: product.id,
            name: product.name,
            price: product.price,
            final_price: product.active_promotions?.length > 0 
              ? calculateDiscountedPrice(product.price, product.active_promotions[0])
              : product.price,
            image_url: product.image_url,
            quantity: (existingItem?.quantity || 0) + 1,
            active_promotions: product.active_promotions
          }
        },
        company: company ? {
          id: company.id,
          name: company.name
        } : prevCart.company
      };
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const newItems = { ...prevCart.items };
      delete newItems[productId];
      const newCart = {
        items: newItems,
        company: Object.keys(newItems).length > 0 ? prevCart.company : null
      };
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        items: {
          ...prevCart.items,
          [productId]: {
            ...prevCart.items[productId],
            quantity
          }
        }
      };
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [removeFromCart, updateLocalStorage]);

  const getCartTotal = useCallback(() => {
    return Object.values(cart.items).reduce((total, item) => {
      return total + (parseFloat(item.final_price) * item.quantity);
    }, 0);
  }, [cart.items]);

  const clearCart = useCallback(() => {
    setCart({ items: {}, company: null });
    const savedCart = JSON.parse(localStorage.getItem('shopping_cart') || '{}');
    delete savedCart[companyId];
    localStorage.setItem('shopping_cart', JSON.stringify(savedCart));
  }, [companyId]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  };
};

// Utility function to calculate discounted price
const calculateDiscountedPrice = (price, promotion) => {
  if (!promotion) return price;
  const basePrice = parseFloat(price);
  if (promotion.discount_type === 'PERCENTAGE') {
    return (basePrice * (1 - parseFloat(promotion.discount_value) / 100)).toFixed(2);
  }
  return (basePrice - parseFloat(promotion.discount_value)).toFixed(2);
};

// ImageWithFallback Component
const ImageWithFallback = React.memo(({ src, alt, className }) => {
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
});

// PromotionBadge Component
const PromotionBadge = React.memo(({ promotion }) => {
  const isPercentage = promotion.discount_type === 'PERCENTAGE';

  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
      <div className="relative group">
        <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg animate-bounce-slow">
          <Flame 
            className="w-5 h-5 text-orange-500 animate-pulse" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
            }}
          />
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full right-0 mb-2 whitespace-nowrap">
          <div className="bg-white dark:bg-gray-800 text-xs rounded-lg py-1 px-2 shadow-lg">
            {promotion.title}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-fade-in-right">
        {isPercentage ? (
          <span>{promotion.discount_display} OFF</span>
        ) : (
          <span>Ahorra ${promotion.discount_value}</span>
        )}
      </div>
    </div>
  );
});

// ProductCard Component
const ProductCard = React.memo(({ product, onClick }) => {
  const hasPromotion = product.active_promotions && product.active_promotions.length > 0;
  const promotion = hasPromotion ? product.active_promotions[0] : null;

  const handleClick = useCallback(() => {
    onClick(product);
  }, [product, onClick]);

  return (
    <div
      className="flex-none w-[65%] snap-start cursor-pointer"
      style={{ scrollSnapAlign: 'start' }}
      onClick={handleClick}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden relative">
        {hasPromotion && <PromotionBadge promotion={promotion} />}
        <ImageWithFallback 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h4 className="text-lg font-semibold leading-4 mb-2 dark:text-white">{product.name}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-4 line-clamp-2">{product.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-green-600 dark:text-green-400 font-bold">
              ${hasPromotion ? calculateDiscountedPrice(product.price, promotion) : product.price}
            </p>
            {hasPromotion && (
              <p className="text-gray-400 line-through text-sm">
                ${product.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// CategoryButton Component
const CategoryButton = React.memo(({ category, isSelected, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(category.id, category.name);
  }, [category, onClick]);

  return (
    <button
      onClick={handleClick}
      className={`flex-shrink-0 px-4 py-2 mx-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        isSelected
          ? 'bg-cyan-400 text-white shadow-lg dark:bg-cyan-600'
          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      } backdrop-filter backdrop-blur-lg bg-opacity-30 shadow-md`}
    >
      {category.name}
    </button>
  );
});

// Main CompanyDetail Component
const CompanyDetail = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nextTime, setNextTime] = useState('');
  const [hasTrackedVisit, setHasTrackedVisit] = useState(false);

  const { id } = useParams();
  const categoryCarouselRef = useRef(null);
  const carouselRefs = useRef({});
  
  const { trackCompanyVisit, trackCategoryClick } = useUserTracking();
  const { addToCart: addToCartHook, cart } = useShoppingCart(id);
  const { toast, showToast, hideToast } = useToast();

  const formatTime = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }, []);

  const checkBusinessHours = useCallback((businessHours) => {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = businessHours[currentDay];
    if (!todayHours) return { isOpen: false, nextTime: 'N/A' };

    const [openHour, openMinute] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    if (currentTime >= openTime && currentTime < closeTime) {
      return { isOpen: true, nextTime: formatTime(todayHours.close) };
    } else {
      let nextDay = currentDay;
      let daysChecked = 0;
      while (daysChecked < 7) {
        const nextDayIndex = (days.indexOf(nextDay) + 1) % 7;
        nextDay = days[nextDayIndex];
        if (businessHours[nextDay]) {
          return { isOpen: false, nextTime: formatTime(businessHours[nextDay].open) };
        }
        daysChecked++;
      }
      return { isOpen: false, nextTime: 'N/A' };
    }
  }, [formatTime]);

  const toggleCategory = useCallback((categoryId, categoryName) => {
    trackCategoryClick(categoryId, categoryName);
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, [trackCategoryClick]);

  const filteredProductsByCategory = useMemo(() => {
    if (selectedCategories.length === 0) return productsByCategory;
    return Object.fromEntries(
      Object.entries(productsByCategory).filter(([categoryId]) => 
        selectedCategories.includes(parseInt(categoryId))
      )
    );
  }, [productsByCategory, selectedCategories]);

  const startDragging = useCallback((e, ref) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback((e, ref) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const getCarouselProducts = useCallback((products) => {
    if (products.length <= 2) return products;
    return [...products, ...products, ...products];
  }, []);

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const addToCart = useCallback((product) => {
    addToCartHook(product, company);
    closeProductModal();
    showToast(`${product.name} agregado al carrito`, 'success'); // <- Corrección aquí
  }, [addToCartHook, company, closeProductModal, showToast]); // Añadir showToast a las dependencias

  useEffect(() => {
    let isMounted = true;
    
    const fetchCompanyAndProducts = async () => {
      try {
        const [companyResponse, productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/companies/${id}/`),
          axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/products/`),
          axios.get(`https://backendfindout-ea692e018a66.herokuapp.com/api/categories/`)
        ]);

        if (!isMounted) return;

        const companyData = companyResponse.data;
        const { isOpen: openStatus, nextTime: nextTimeValue } = checkBusinessHours(companyData.business_hours);
        
        const companyProducts = productsResponse.data.filter(product => product.company === parseInt(id));
        const grouped = companyProducts.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});

        const categoriesWithProducts = categoriesResponse.data.filter(
          category => grouped[category.id]
        );

        setCompany(companyData);
        setIsOpen(openStatus);
        setNextTime(nextTimeValue);
        setProductsByCategory(grouped);
        setCategories(categoriesWithProducts);

        if (!hasTrackedVisit) {
          trackCompanyVisit(companyData);
          setHasTrackedVisit(true);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompanyAndProducts();

    return () => {
      isMounted = false;
    };
  }, [id, checkBusinessHours, trackCompanyVisit, hasTrackedVisit]);

  if (loading) {
    return <CompanyDetailSkeleton />;
  }

  if (!company) {
    return <div className="dark:text-white">No se encontró la empresa</div>;
  }

  return (
    <div className="flex flex-col items-center font-poppins dark:bg-gray-900">
      {/* Sección del perfil de la empresa */}
      <section className="w-full mb-3 flex flex-col items-center">
        {/* Profile Image and Name Section */}
        <div className="flex flex-col items-center mb-4 mt-2">
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin-slow" style={{
              backgroundImage: 'linear-gradient(0deg, #09fdfd, #66ffff, #ff9dd1, #ff69b4, #09fdfd)',
              backgroundSize: '100% 400%',
              animation: 'rotating 2s linear infinite, gradientRotate 5s linear infinite'
            }}></div>
            <ImageWithFallback 
              src={company.profile_picture_url} 
              alt={company.name} 
              className="w-[88px] h-[88px] absolute rounded-full object-cover border-4 border-inherit border-solid"
            />
            {company.country?.flag_icon_url && (
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 shadow-md overflow-hidden">
                <img 
                  src={company.country.flag_icon_url} 
                  alt={`Bandera de ${company.country.name}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/32/32";
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-gray-600 dark:text-gray-300 text-2xl leading-4 font-extrabold">{company.name}</h3>
            <p className="text-[#09fdfd] dark:text-[#09fdfd] text-base font-medium">
              {company.category && typeof company.category === 'object' 
                ? company.category.name 
                : (company.category || 'Categoría de la empresa')}
            </p>
          </div>
        </div>

        {/* Categories Carousel */}
        <div 
          ref={categoryCarouselRef}
          className="w-full flex justify-center overflow-x-auto snap-x snap-mandatory scrollbar-hide mb-2 pb-2 px-4"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={(e) => categoryCarouselRef.current && startDragging(e, categoryCarouselRef)}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onMouseMove={(e) => categoryCarouselRef.current && onDrag(e, categoryCarouselRef)}
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

        {/* Info and Status Section */}
        <div className="w-full px-3 rounded-lg pb-4">
          <div className="flex items-start gap-2">
            {/* Status */}
            <div className="flex flex-col items-center min-w-fit">
              <h3 className={`text-xl font-bold ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOpen ? 'ABIERTO' : 'CERRADO'}
              </h3>   
              <p className="text-sm text-gray-600 dark:text-gray-300 border rounded-full px-3 py-1">
                {isOpen ? `Hasta ${nextTime}` : `Abre ${nextTime}`}
              </p>
            </div>

            {/* Description */}
            <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-4">
              <p className="text-sm leading-4 text-gray-600 dark:text-gray-300">
                {company.description}
              </p>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="w-11/12 flex justify-center gap-3">
          {company.google_maps_url && (
            <a 
              href={company.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border-2 border-[#09fdfd] hover:bg-[#09fdfd]/10 transition-all duration-300"
            >
              <MapPin className="w-5 h-5 text-[#09fdfd]" />
            </a>
          )}

          {company.whatsapp_url && (
            <a 
              href={company.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#09fdfd] text-white font-bold text-sm shadow hover:shadow-md transition-all duration-300 hover:shadow-cyan-300"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir
            </a>
          )}
          
          {company.instagram_url && (
            <a 
              href={company.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 w-10 h-10 flex items-center justify-center bg-[#09fdfd] rounded-full shadow hover:shadow-md transition-all duration-300 text-white"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          
          {company.facebook_url && (
            <a 
              href={company.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 w-10 h-10 flex items-center justify-center bg-[#09fdfd] rounded-full shadow hover:shadow-md transition-all duration-300 text-white"
            >
              <Facebook className="w-5 h-5" />
            </a>
          )}
        </div>
      </section>

      <BadgesSection badges={company.badges} />

      {/* Products Section */}
      <section className="w-full">
        {Object.entries(filteredProductsByCategory).map(([categoryId, products]) => (
          <div key={categoryId} className="mb-0">
            <h4 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300 px-4">
              {categories.find(cat => cat.id === parseInt(categoryId))?.name || 'Categoría'}
            </h4>
            <div 
              className="overflow-x-hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div
                ref={el => carouselRefs[categoryId] = el}
                className="flex gap-4 px-4 pb-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onMouseDown={(e) => carouselRefs[categoryId] && startDragging(e, { current: carouselRefs[categoryId] })}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onMouseMove={(e) => carouselRefs[categoryId] && onDrag(e, { current: carouselRefs[categoryId] })}
              >
                {getCarouselProducts(products).map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    onClick={() => openProductModal(product)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <MenuBar />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
      />

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
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        @keyframes fade-in-right {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default React.memo(CompanyDetail);