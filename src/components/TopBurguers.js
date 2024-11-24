import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkeletonItem = () => (
  <div className="w-full animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"></div>
    <div className="mt-2 flex items-center justify-center">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <section className="flex flex-col items-center w-full mb-4 animate-fadeIn">
    <div className="flex items-center gap-2 w-full mb-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-3 gap-4 w-full">
      {[1, 2, 3].map((n) => (
        <SkeletonItem key={n} />
      ))}
    </div>
  </section>
);

const TopBurgers = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    // Agregar estilos de animación
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
      .card-hover {
        transition: all 0.3s ease;
      }
      .card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(styleSheet);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());

    const fetchData = async () => {
      try {
        const response = await axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/top-burgers/');
        setSections(response.data);
        setLoading(false);
        
        setTimeout(() => {
          document.querySelectorAll('.animated-card').forEach(card => {
            observer.observe(card);
          });
        }, 100);
      } catch (error) {
        console.error('Error fetching top burgers data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();

    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModeEnabled);

    return () => {
      observer.disconnect();
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleImageLoad = (imageId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const isFullWidthBanner = (section) => {
    return section.items.length === 1 && section.items[0].item_type === 'BANNER';
  };

  const renderItem = (item, index) => {
    const imageId = `${item.order}-${item.featured_image}`;
    const isImageLoaded = imagesLoaded[imageId];

    if (item.item_type === 'BANNER') {
      return (
        <div 
          className="w-full transform transition-all duration-500 hover:scale-105 animated-card"
          id={imageId}
        >
          <a href={item.custom_url} className="block overflow-hidden rounded-lg">
            {!isImageLoaded && (
              <div className="w-full aspect-[21/9] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
            <img
              src={item.featured_image}
              alt="Banner"
              className={`w-full h-auto object-cover transition-transform duration-700 ${!isImageLoaded ? 'hidden' : ''}`}
              onLoad={() => handleImageLoad(imageId)}
            />
          </a>
        </div>
      );
    }

    return (
      <div 
        id={imageId}
        className={`animated-card card-hover transition-all duration-500 opacity-0 translate-y-8`}
        style={{ 
          transitionDelay: `${index * 150}ms`,
          animation: isVisible[imageId] ? 'fadeIn 0.5s ease-out forwards' : 'none',
          animationDelay: `${index * 150}ms`
        }}
      >
        <a 
          href={item.company_profile_url}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-lg aspect-square">
            {!isImageLoaded && (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
            <img
              src={item.featured_image}
              alt={item.company_name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${!isImageLoaded ? 'hidden' : ''}`}
              onLoad={() => handleImageLoad(imageId)}
            />
            <img 
              src={item.company_logo}
              alt={`${item.company_name} logo`}
              className={`absolute top-2 left-2 border-2 border-white w-8 h-8 rounded-full 
                        object-cover shadow-lg ${!isImageLoaded ? 'hidden' : ''}`}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-center text-neutral-700 dark:text-neutral-300">
            {item.company_name}
          </p>
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2].map((n) => (
          <SkeletonSection key={n} />
        ))}
      </div>
    );
  }

  if (error) return <div className="font-system dark:text-white">Error loading data</div>;

  return (
    <div className={`flex flex-col gap-6 font-system ${isDarkMode ? 'dark' : ''}`}>
      {sections.map((section) => {
        const fullWidthBanner = isFullWidthBanner(section);
        
        return (
          <section 
            key={section.title} 
            className="animate-fadeIn"
          >
            <div className="flex items-center gap-2 w-full mb-4">
              <h3 className="font-bold text-lg text-neutral-700 dark:text-neutral-300">
                {section.title}
              </h3>
              <p className="text-sm text-gray-400">{section.location}</p>
            </div>

            <div className={fullWidthBanner ? 
              'w-full' : 
              'grid grid-cols-3 gap-4'
            }>
              {section.items.map((item, index) => renderItem(item, index))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TopBurgers;