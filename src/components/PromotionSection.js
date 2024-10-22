import React, { useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

const PromotionSection = ({ promotions }) => {
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  // Condicionar la configuración dependiendo del número de promociones
  const settings = {
    dots: true,
    infinite: promotions.length > 1, // Solo habilita "infinite" si hay más de una promoción
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="w-full mb-8">
      <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300 px-4">Promociones activas</h3>
      <Slider {...settings} className="px-4">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="w-full flex items-center justify-center">
            <div
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-64 cursor-pointer"
              onClick={() => openModal(promotion)}
            >
              <img
                src={promotion.banner_url}
                alt={promotion.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold dark:text-white mb-2">{promotion.title}</h4>
                <p className="text-green-600 dark:text-green-400 font-bold">
                  {promotion.discount_display}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {isModalOpen && selectedPromotion && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 w-full md:w-1/2 lg:w-1/3 rounded-t-lg p-6">
            <button
              className="text-right text-xl font-bold text-gray-600 dark:text-gray-300 mb-4"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold dark:text-white mb-4">{selectedPromotion.title}</h2>
            <p className="dark:text-gray-300 mb-4">{selectedPromotion.description}</p>
            <p className="text-lg text-green-600 dark:text-green-400 font-bold mb-4">
              {selectedPromotion.discount_display}
            </p>

            {selectedPromotion.related_products && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold dark:text-white mb-2">Productos relacionados:</h3>
                <ul className="list-disc list-inside dark:text-gray-300">
                  {selectedPromotion.related_products.map((product) => (
                    <li key={product.id}>
                      <Link to={`/product/${product.id}`} className="text-cyan-400 dark:text-cyan-300">
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PromotionSection;
