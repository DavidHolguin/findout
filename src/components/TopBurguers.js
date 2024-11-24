import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkeletonItem = () => (
  <div className="w-full animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
    <div className="mt-2 flex items-center">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="ml-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <section className="flex flex-col items-center w-full mb-4">
    <div className="flex items-center gap-2 w-full mb-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="flex justify-around gap-2 w-full">
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

  useEffect(() => {
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());

    const fetchData = async () => {
      try {
        // Start timing when fetch begins
        const startTime = Date.now();
        
        const response = await axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/top-burgers/');
        
        // Calculate how long the fetch took
        const fetchDuration = Date.now() - startTime;
        
        // If fetch was faster than 2000ms, wait for the remaining time
        const remainingTime = Math.max(0, 2000 - fetchDuration);
        
        // Set data and loading state after the minimum time has passed
        setTimeout(() => {
          setSections(response.data);
          setLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error('Error fetching top burgers data:', error);
        // Even on error, maintain minimum loading time
        setTimeout(() => {
          setError(error);
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();

    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModeEnabled);

    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addListener(handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeListener(handleDarkModeChange);
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

  const renderItem = (item, isFullWidth = false) => {
    const imageId = `${item.order}-${item.featured_image}`;
    const isImageLoaded = imagesLoaded[imageId];

    if (isFullWidth) {
      return (
        <div className="relative w-full">
          <a 
            href={item.custom_url}
            className="block"
          >
            {!isImageLoaded && (
              <div className="w-full h-[248px] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
            <img
              src={item.featured_image}
              alt="Banner"
              className={`w-full h-auto object-cover ${!isImageLoaded ? 'hidden' : ''}`}
              onLoad={() => handleImageLoad(imageId)}
            />
          </a>
        </div>
      );
    }

    return (
      <div key={item.order} className="text-center relative font-system">
        <a 
          href={item.item_type === 'BANNER' ? item.custom_url : item.company_profile_url}
          className="block relative"
        >
          {!isImageLoaded && (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          )}
          <img
            src={item.featured_image}
            alt={item.item_type === 'BANNER' ? 'Banner' : item.company_name}
            className={`w-full h-auto rounded-lg ${!isImageLoaded ? 'hidden' : ''}`}
            onLoad={() => handleImageLoad(imageId)}
          />
          {item.item_type === 'COMPANY' && (
            <>
              <img 
                src={item.company_logo}
                alt={`${item.company_name} logo`}
                className={`absolute top-2 left-2 border-2 border-inherit w-[35px] h-[35px] rounded-full object-cover shadow-[inset_0_1px_2px_0_rgba(60,64,67,0.3),inset_0_2px_6px_2px_rgba(60,64,67,0.15)] ${!isImageLoaded ? 'hidden' : ''}`}
              />
              <p className={`font-extrabold mt-1 text-sm text-neutral-700 dark:text-neutral-300 leading-4 flex items-center justify-center ${!isImageLoaded ? 'hidden' : ''}`}>
                <span className="inline-block w-1.5 h-1.5 bg-primary dark:bg-[#09fdfd] rounded-full mr-1"></span>
                {item.company_name}
              </p>
            </>
          )}
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
    <div className={`flex flex-col gap-1 font-system ${isDarkMode ? 'dark' : ''}`}>
      {sections.map((section) => {
        const fullWidthBanner = isFullWidthBanner(section);
        
        if (fullWidthBanner) {
          return (
            <section 
              key={section.title} 
              className="relative w-full pb-2 pt-1"
            >
              <div className={`${isIOS ? 'w-full overflow-hidden' : 'w-screen relative left-1/2 right-1/2 -mx-[50vw]'}`}
                   style={isIOS ? {
                     width: '100vw',
                     marginLeft: 'calc(-50vw + 50%)',
                     marginRight: 'calc(-50vw + 50%)'
                   } : {}}
              >
                {renderItem(section.items[0], true)}
              </div>
            </section>
          );
        }

        return (
          <section key={section.title} className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 w-full mb-2">
              <h3 className="font-extrabold m-0 text-xl text-neutral-700 dark:text-neutral-300">
                {section.title.split(' ').map((word, index, array) => {
                  const shouldBeColored = 
                    (array.includes('BURGUERS') && index === 2) || 
                    (array.includes('BARBER') && word === 'SHOP') ||
                    (word === 'LATINOS');
                  
                  return shouldBeColored ? (
                    <span key={index} className="text-slate-900 dark:text-[#09fdfd]">{word} </span>
                  ) : (
                    word + ' '
                  );
                })}
              </h3>
              <p className="m-0 text-[15px] text-gray-400 dark:text-gray-400">{section.location}</p>
              <svg
                id="Layer_1"
                height="10"
                viewBox="0 0 512 512"
                width="10"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-primary dark:fill-[#09fdfd]"
              >
                <g>
                  <path d="M229.001 40.03c-15.494-15.497-36.094-24.03-58.005-24.03s-42.51 8.532-58.007 24.025c-15.492 15.495-24.024 36.094-24.024 58.007 0 21.911 8.532 42.512 24.025 58.004l99.748 99.75-100.536 100.538c-15.885 15.885-24.412 37.004-24.013 59.469.399 22.458 9.687 43.271 26.153 58.606 14.955 13.929 34.593 21.601 55.293 21.601 22.186 0 43.924-9.015 59.644-24.735l179.783-179.783c19.682-19.682 19.682-51.709 0-71.391zm153.29 224.68-179.783 179.783c-8.672 8.672-20.653 13.646-32.872 13.646-11.092 0-21.565-4.066-29.489-11.446-8.88-8.27-13.887-19.482-14.102-31.572-.216-12.1 4.377-23.472 12.93-32.025l109.463-109.464c9.836-9.84 9.836-25.851-.002-35.693l-108.675-108.675c-8.341-8.342-12.935-19.433-12.935-31.232s4.594-22.893 12.935-31.235c8.344-8.342 19.436-12.936 31.235-12.936 11.798 0 22.89 4.595 31.233 12.939l180.062 180.062c4.921 4.921 4.921 12.927 0 17.848z" />
                </g>
              </svg>
            </div>

            <div className="flex justify-around gap-2 w-full mb-2">
              {section.items.map(item => renderItem(item, false))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TopBurgers;