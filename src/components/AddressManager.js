import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, Heart, X, Loader2 } from 'lucide-react';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    type: 'casa',
    details: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
    // Detectar modo oscuro del sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const saveAddresses = (newAddresses) => {
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
    setAddresses(newAddresses);
  };

  const getLocation = async () => {
    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      setNewAddress(prev => ({
        ...prev,
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6)
      }));
    } catch (error) {
      alert('Error al obtener la ubicación: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.latitude || !newAddress.longitude) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
    saveAddresses(updatedAddresses);
    setNewAddress({
      name: '',
      type: 'casa',
      details: '',
      latitude: '',
      longitude: ''
    });
    setShowModal(false);
  };

  const deleteAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    saveAddresses(updatedAddresses);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'casa':
        return <Home className="w-6 h-6 text-blue-500" />;
      case 'trabajo':
        return <Briefcase className="w-6 h-6 text-green-500" />;
      case 'favorito':
        return <Heart className="w-6 h-6 text-red-500" />;
      default:
        return <MapPin className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        
          <div className="flex gap-4">
            
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Agregar Dirección
            </button>
          </div>
        </div>

        {/* Lista de direcciones */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getIcon(address.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {address.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {address.details}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{address.latitude}, {address.longitude}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío */}
        {addresses.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              No tienes direcciones guardadas
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Comienza agregando tu primera dirección
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Agregar Nueva Dirección
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del lugar
                  </label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ej: Mi Casa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de lugar
                  </label>
                  <select
                    value={newAddress.type}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="casa">Casa</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="favorito">Favorito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detalles adicionales
                  </label>
                  <input
                    type="text"
                    value={newAddress.details}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, details: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ej: Apartamento 302, Torre 1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Latitud
                    </label>
                    <input
                      type="text"
                      value={newAddress.latitude}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Longitud
                    </label>
                    <input
                      type="text"
                      value={newAddress.longitude}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-300"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                  {isLoading ? 'Obteniendo ubicación...' : 'Obtener ubicación actual'}
                </button>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManager;