import React, { useEffect, useState } from 'react';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    'https://findout.store/wp-content/uploads/2024/05/FindoutSlider1.webp', 
    'https://findout.store/wp-content/uploads/2024/05/FindoutSlider3.webp',
    'https://findout.store/wp-content/uploads/2024/05/FindoutSlider2.webp',
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Cambia de imagen cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-48 rounded-2xl "
            style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
