import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useUserTracking } from '../hooks/useUserTracking';
import { Link } from 'react-router-dom';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dc3vcn9g6/';

const PersonalizedCategorySlider = () => {
  const { getUserPreferences } = useUserTracking();
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);
  const autoplayRef = useRef(null);

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '/api/placeholder/400/320';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${CLOUDINARY_BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const visits = JSON.parse(localStorage.getItem('user_company_visits') || '[]');
    const categoryMap = new Map();
    
    visits.forEach(visit => {
      if (visit.category?.id) {
        const categoryId = visit.category.id;
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            id: categoryId,
            name: visit.category.name,
            image: visit.category.image
          });
        }
      }
    });
    
    const uniqueCategories = Array.from(categoryMap.values());
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % categories.length);
      }, 3000);
    };

    if (categories.length > 1) {
      startAutoplay();
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [categories.length]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > minSwipeDistance;
    
    if (isSwipe) {
      if (distance > 0) {
        setCurrentIndex(prev => (prev + 1) % categories.length);
      } else {
        setCurrentIndex(prev => (prev - 1 + categories.length) % categories.length);
      }
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-2 mb-2">
      <h2 className="text-base leading-6 text-gray-600 dark:text-gray-400 ms-5">Basado en tus intereses</h2>
      
      <div 
        ref={sliderRef}
        className="relative w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {categories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              to={`/company-categories/${category.id}`}
              className="w-full flex-none"
              style={{ minWidth: '100%' }}
            >
              <div>
                <div className="relative h-[58px] rounded-2xl overflow-hidden border-2 border-primary">
                  <div className="flex h-[58px]  items-center justify-between p-4  dark:bg-gradient-to-l dark:from-primary/80 dark:via-primary/20 dark:to-transparent">
                    <div className="flex gap-4 items-center flex-row min-w-0 relative">
                      <div>
                        <h3 className="text-xl text-[#4d4d4d] dark:text-gray-200 font-bold leading-5">Seguir explorando</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-base leading-6">{category.name}</p>
                      </div>
                      
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="27" fill="none" viewBox="0 0 22 27">
                        <path fill="#0FF" d="M11.17 13.5c-.87-.97-1.72-1.91-2.57-2.85C6.19 7.97 3.79 5.3 1.37 2.62 1 2.2.83 1.74 1.07 1.21 1.3.69 1.75.5 2.3.5c2.26 0 4.52.01 6.78 0 .46 0 .82.18 1.12.52 2.81 3.13 5.62 6.25 8.43 9.37.67.75 1.35 1.49 2.01 2.24.52.58.53 1.18.01 1.75L10.18 26.02c-.29.32-.64.48-1.06.48H2.26c-.53 0-.97-.19-1.2-.69-.23-.51-.09-.98.28-1.39 3.12-3.47 6.25-6.94 9.37-10.4.15-.16.29-.32.46-.52Z"/>
                      </svg>
                    </div>
                    <div className="ml-8">
                      <img 
                        src={getFullImageUrl(category.image)} 
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedCategorySlider;