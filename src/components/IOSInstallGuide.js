import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart, ChevronLeft } from 'lucide-react';

// Correct Safari icon with proper chevron
const SafariIcon = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6">
    <path
      fill="currentColor"
      d="M 256 48 C 141.1 48 48 141.1 48 256 s 93.1 208 208 208 s 208 -93.1 208 -208 S 370.9 48 256 48 z M 256 446.7 c -105.1 0 -190.7 -85.5 -190.7 -190.7 S 150.9 65.3 256 65.3 s 190.7 85.5 190.7 190.7 S 361.1 446.7 256 446.7 z M 256 121.3 c -74.2 0 -134.7 60.5 -134.7 134.7 s 60.5 134.7 134.7 134.7 s 134.7 -60.5 134.7 -134.7 S 330.2 121.3 256 121.3 z M 282.7 256 l 67.3 -67.3 c 7.4 -7.4 7.4 -19.4 0 -26.8 c -7.4 -7.4 -19.4 -7.4 -26.8 0 L 256 229.3 l -67.3 -67.3 c -7.4 -7.4 -19.4 -7.4 -26.8 0 c -7.4 7.4 -7.4 19.4 0 26.8 L 229.3 256 l -67.3 67.3 c -7.4 7.4 -7.4 19.4 0 26.8 c 3.7 3.7 8.5 5.5 13.4 5.5 s 9.7 -1.8 13.4 -5.5 L 256 282.7 l 67.3 67.3 c 3.7 3.7 8.5 5.5 13.4 5.5 s 9.7 -1.8 13.4 -5.5 c 7.4 -7.4 7.4 -19.4 0 -26.8 L 282.7 256 z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" className="w-6 h-6">
    <path 
      fill="currentColor"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </svg>
);

const IOSInstallGuide = () => {
  const steps = [
    {
      id: 1,
      text: "Use el botón inferior en el medio de su navegador",
      icon: <Share2 className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 2,
      text: "Deslice hacia abajo y busque el botón de 'Agregar a Inicio'",
      preview: (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-2 w-full max-w-xs mx-auto border-2 border-blue-500">
          <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-700 rounded-lg">
            <span>Agregar a Inicio</span>
            <span className="text-xl">+</span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      text: 'Use el botón superior derecho "Agregar" y listo.',
      preview: (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mt-2 w-full max-w-xs mx-auto border-2 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <button className="text-gray-500 dark:text-gray-400">Cancelar</button>
            <span className="font-semibold">Agregar a Inicio</span>
            <button className="text-blue-500 font-semibold">Agregar</button>
          </div>
          <div className="flex items-center space-x-3 p-2">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <div>
              <p className="font-semibold dark:text-white">Findout</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">https://findout.store/</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-200">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <AppleIcon />
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <SafariIcon />
        </div>
        <h2 className="text-2xl font-semibold dark:text-white">Instalación iOS</h2>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step.id * 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                {step.id}
              </div>
              <p className="flex-grow text-gray-700 dark:text-gray-300">{step.text}</p>
              {step.icon && <div className="flex-shrink-0">{step.icon}</div>}
            </div>
            {step.preview && <div className="mt-4 w-full">{step.preview}</div>}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">F</span>
          </div>
          <p className="text-sm dark:text-gray-300">
            Ya puede buscar <span className="font-semibold">findout</span><br />
            en las aplicaciones de su teléfono
          </p>
        </div>
        <button className="w-full bg-black dark:bg-gray-700 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Volver al home</span>
          <Heart className="w-5 h-5 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};

export default IOSInstallGuide;