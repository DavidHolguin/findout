import React from 'react';
import { Heart, Star } from 'lucide-react';

const JoinFindoutPage = () => {
  const benefits = [
    {
      text: "Tu negocio, producto y servicio se mostrarán en el algoritmo de búsqueda"
    },
    {
      text: "Añade un menú de tus productos / servicios"
    },
    {
      text: "Recibe insignias por tus valoraciones como negocio"
    },
    {
      text: "Accede a promociones para ser destacar en la seccion principal"
    },
    {
      text: "Tus clientes pueden solicitar entregas de tus productos de manera facil"
    }
  ];

  return (
    <div className="fixed inset-0 z-20 flex flex-col mt-[84px] bg-white">
      <div className="flex-1 overflow-auto bg-gradient-to-b from-white dark:from-gray-900 from-0% via-white dark:via-gray-900 via-80% to-[#09FDFD] dark:to-[#077f7f] to-100%">
        <div className="container mx-auto px-8 py-6 max-w-lg">
          {/* Imagen con posición mejorada */}
          <div className="relative w-full aspect-[2/1] mb-8 mt-4">
            <img 
              src="/vectorRegisterCompany.png"
              alt="Register Company"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Main Text */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-8">
              Deja que tu negocio sea descubierto por la comunidad hispana
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-6">
              Y explora beneficios según la categoría de tu negocio
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 shadow-md rounded-full bg-[#09FDFD] dark:bg-[#077f7f] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-5 text-sm">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Join Button with Single Light Animation */}
          <div className="sticky bottom-0  pt-4 pb-6">
            <div className="relative">
              {/* Animated light point */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0"
                     style={{
                       background: 'conic-gradient(from 0deg, transparent, #09FDFD 10%, transparent 20%)',
                       animation: 'rotateLight 3s linear infinite',
                     }}>
                </div>
              </div>
              {/* Button background mask */}
              <div className="absolute inset-[1.5px] rounded-full bg-black dark:bg-white"></div>
              <button className="relative w-full bg-transparent text-white dark:text-black py-4 rounded-full font-medium flex items-center justify-center space-x-2 transition-transform hover:scale-105">
                <span>Unirme a Findout</span>
                <Heart className="w-5 h-5 text-[#09FDFD] dark:text-[#077f7f]" />
              </button>
            </div>
            <p className="text-center text-gray-900 dark:text-white font-medium mt-3">
              Por solo <span className="text-gray-900 dark:text-white font-bold text-xl">$7,99</span> / mes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinFindoutPage;