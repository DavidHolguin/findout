import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, MapPin, Home, Download } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: false,
    location: false,
    addresses: [],
  });
  const [newAddress, setNewAddress] = useState({
    state: '',
    city: '',
    street: '',
    references: '',
    postalCode: '',
  });
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      loadSettings();
    }
  }, [navigate]);

  const loadSettings = () => {
    const storedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setSettings(prevSettings => ({
      ...prevSettings,
      ...storedSettings,
      darkMode: isDarkMode,
    }));
    applyDarkMode(isDarkMode);
  };

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggle = (setting) => {
    const newValue = !settings[setting];
    if (setting === 'darkMode') {
      localStorage.setItem('darkMode', newValue);
      applyDarkMode(newValue);
    }
    saveSettings({ [setting]: newValue });

    if (setting === 'notifications' && newValue) {
      requestNotificationPermission();
    }

    if (setting === 'location' && newValue) {
      requestLocationPermission();
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        saveSettings({ notifications: false });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      saveSettings({ notifications: false });
    }
  };

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveSettings({ location: true });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener tu ubicación. Por favor, verifica la configuración de tu navegador.');
          saveSettings({ location: false });
        }
      );
    } else {
      alert('La geolocalización no es compatible con tu navegador');
      saveSettings({ location: false });
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
    if (Object.values(newAddress).some(value => value.trim() !== '')) {
      saveSettings({ addresses: [...settings.addresses, newAddress] });
      setNewAddress({ state: '', city: '', street: '', references: '', postalCode: '' });
    }
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = settings.addresses.filter((_, i) => i !== index);
    saveSettings({ addresses: updatedAddresses });
  };

  const handleDownloadApp = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=your.app.id';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/20 shadow-xl rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <SettingsIcon size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white">Modo Oscuro</span>
              </div>
              <label className="theme">
                <span className="theme__toggle-wrap">
                  <input
                    id="theme"
                    className="theme__toggle"
                    type="checkbox"
                    role="switch"
                    name="theme"
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                  />
                  <span className="theme__fill"></span>
                  <span className="theme__icon">
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                  </span>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className={settings.notifications ? "text-primary" : "text-gray-400 dark:text-gray-500"} />
                <span className="text-gray-900 dark:text-white">Notificaciones</span>
              </div>
              <label className="theme">
                <span className="theme__toggle-wrap">
                  <input
                    className="theme__toggle"
                    type="checkbox"
                    role="switch"
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                  <span className="theme__fill"></span>
                  <span className="theme__icon">
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                  </span>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className={settings.location ? "text-primary" : "text-gray-400 dark:text-gray-500"} />
                <span className="text-gray-900 dark:text-white">Ubicación</span>
              </div>
              <label className="theme">
                <span className="theme__toggle-wrap">
                  <input
                    className="theme__toggle"
                    type="checkbox"
                    role="switch"
                    checked={settings.location}
                    onChange={() => handleToggle('location')}
                  />
                  <span className="theme__fill"></span>
                  <span className="theme__icon">
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                    <span className="theme__icon-part"></span>
                  </span>
                </span>
              </label>
            </div>

            <div className="space-y-4 pb-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Home className="text-primary" />
                <span className="text-gray-900 dark:text-white">Direcciones de Entrega</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  placeholder="Estado"
                  className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  placeholder="Ciudad"
                  className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  placeholder="Dirección"
                  className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 col-span-2"
                />
                <input
                  type="text"
                  name="references"
                  value={newAddress.references}
                  onChange={handleAddressChange}
                  placeholder="Referencias adicionales"
                  className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 col-span-2"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Código Postal"
                  className="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                  onClick={handleAddAddress}
                  className="p-2 bg-primary hover:bg-primary-dark text-white rounded transition"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-2">
                {settings.addresses.map((address, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="text-gray-900 dark:text-white">
                      {address.street}, {address.city}, {address.state} {address.postalCode}
                    </span>
                    <button
                      onClick={() => handleRemoveAddress(index)}
                      className="px-2 py-1 bg-primary hover:bg-primary-dark text-white rounded transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleDownloadApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
              >
                <Download size={20} />
                Descargar App
              </button>
            </div>
          </div>
        </div>

        {showIOSInstructions && (
          <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/20 shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Instalar en iOS</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-900 dark:text-white">
              <li>Abre esta página en Safari</li>
              <li>Toca el botón Compartir</li>
              <li>Desplázate hacia abajo y toca "Añadir a la pantalla de inicio"</li>
              <li>Toca "Añadir" en la esquina superior derecha</li>
            </ol>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;