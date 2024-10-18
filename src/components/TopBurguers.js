import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopBurgers = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backendfindout-ea692e018a66.herokuapp.com/api/top-burgers/');
        setSections(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top burgers data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="font-system">Loading...</div>;
  if (error) return <div className="font-system">Error loading data</div>;

  const renderItem = (item) => {
    const itemUrl = item.item_type === 'BANNER' ? item.click_url : item.company_profile_url;
    
    return (
      <div key={item.order} className="text-center relative font-system">
        {item.item_type === 'COMPANY' && (
          <span 
            className="absolute top-0 left-0 mt-1 ml-1 w-[35px] h-[35px] rounded-full bg-cover bg-center bg-no-repeat shadow-[inset_0_1px_2px_0_rgba(60,64,67,0.3),inset_0_2px_6px_2px_rgba(60,64,67,0.15)]" 
            style={{ backgroundImage: `url(${item.company_logo})` }}
          />
        )}
        <a 
          href={itemUrl} 
          target={item.item_type === 'BANNER' ? "_blank" : "_self"}
          rel={item.item_type === 'BANNER' ? "noopener noreferrer" : undefined}
        >
          <img
            src={item.featured_image}
            alt={item.company_name || 'Banner'}
            className="w-full h-auto rounded-lg"
          />
          {item.company_name && (
            <p className="font-extrabold italic mt-1 text-base text-neutral-700	">{item.company_name}</p>
          )}
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 font-system">
      {sections.map((section) => (
        <section key={section.position} className="flex flex-col items-center my-2">
          <div className="flex items-center gap-2 w-[100%] mb-2">
            <h3 className="font-extrabold m-0 text-2xl text-neutral-700">
              {section.title.split(' ').map((word, index, array) => {
                const shouldBeColored = 
                  (array.includes('BURGUERS') && index === 2) || 
                  (array.includes('BARBER') && word === 'SHOP');
                
                return shouldBeColored ? (
                  <span key={index} className="text-[#09fdfd]">{word} </span>
                ) : (
                  word + ' '
                );
              })}
            </h3>
            <p className="m-0 text-lg text-neutral-700">{section.location}</p>
            <svg
              id="Layer_1"
              height="10"
              viewBox="0 0 512 512"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
              fill="#09fdfd"
            >
              <g>
                <path d="M229.001 40.03c-15.494-15.497-36.094-24.03-58.005-24.03s-42.51 8.532-58.007 24.025c-15.492 15.495-24.024 36.094-24.024 58.007 0 21.911 8.532 42.512 24.025 58.004l99.748 99.75-100.536 100.538c-15.885 15.885-24.412 37.004-24.013 59.469.399 22.458 9.687 43.271 26.153 58.606 14.955 13.929 34.593 21.601 55.293 21.601 22.186 0 43.924-9.015 59.644-24.735l179.783-179.783c19.682-19.682 19.682-51.709 0-71.391zm153.29 224.68-179.783 179.783c-8.672 8.672-20.653 13.646-32.872 13.646-11.092 0-21.565-4.066-29.489-11.446-8.88-8.27-13.887-19.482-14.102-31.572-.216-12.1 4.377-23.472 12.93-32.025l109.463-109.464c9.836-9.84 9.836-25.851-.002-35.693l-108.675-108.675c-8.341-8.342-12.935-19.433-12.935-31.232s4.594-22.893 12.935-31.235c8.344-8.342 19.436-12.936 31.235-12.936 11.798 0 22.89 4.595 31.233 12.939l180.062 180.062c4.921 4.921 4.921 12.927 0 17.848z" />
              </g>
            </svg>
          </div>

          <div className="flex justify-around mb-2 gap-2 w-[100%]">
            {section.items.map(renderItem)}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TopBurgers;