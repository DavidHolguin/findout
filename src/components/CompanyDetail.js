import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Instagram, MapPin, Facebook, MessageCircle } from 'lucide-react';
import BadgesSection from './BadgesSection';
import CompanyDetailSkeleton from './CompanyDetailSkeleton';
import CompanyProducts from './CompanyProducts';
import { useUserTracking } from '../hooks/useUserTracking';

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

// Main CompanyDetail Component
const CompanyDetail = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nextTime, setNextTime] = useState('');
  const [hasTrackedVisit, setHasTrackedVisit] = useState(false);

  const { id } = useParams();
  const { trackCompanyVisit } = useUserTracking();

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
      {/* Profile Section */}
      <section className="w-full mb-3 flex flex-col items-center">
        {/* Profile Image and Name */}
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
      <CompanyProducts 
        productsByCategory={productsByCategory} 
        categories={categories}
        companyId={id}
        company={company}
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
      `}</style>
    </div>
  );
};

export default React.memo(CompanyDetail);