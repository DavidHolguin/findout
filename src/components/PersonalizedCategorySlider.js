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
    <div className="w-full mt-4 mb-2">
      <h2 className="text-lg text-gray-600 ms-4">Basado en tus intereses</h2>
      
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
                <div className="relative rounded-3xl overflow-hidden border-2 border-primary ">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-t from-primary/50 to-transparent via-transparent">
                    <div className="flex gap-4 items-center flex-row min-w-0 relative">
                      <div>
                        <h3 className="text-2xl text-[#4d4d4d] font-bold truncate leading-5">Seguir explorando</h3>
                        <p className="text-gray-600 text-lg truncate leading-6">{category.name}</p>
                      </div>
                      
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="33" fill="none" viewBox="0 0 20 33">
                        <path stroke="#09FDFD" stroke-width="5" d="m2 31 14-14.5L2 2"/>
                      </svg>




                    </div>
                    <div className="ml-8">
                      <img 
                        src={getFullImageUrl(category.image)} 
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg"
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