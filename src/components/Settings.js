import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Aquí deberías hacer una llamada a tu API para obtener las configuraciones del usuario
      // Por ahora, simularemos datos de configuración
      setSettings({
        notificationsEnabled: true,
        darkModeEnabled: false,
        language: 'es',
        // Otras configuraciones...
      });
    }
  }, [navigate]);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    // Aquí deberías hacer una llamada a tu API para actualizar la configuración
  };

  if (!settings) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <SettingsIcon size={32} className="text-gray-500 mr-4" />
          <h2 className="text-xl font-semibold">Ajustes de usuario</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notificaciones</span>
            <button
              onClick={() => handleToggle('notificationsEnabled')}
              className={`px-3 py-1 rounded ${settings.notificationsEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            >
              {settings.notificationsEnabled ? 'Activadas' : 'Desactivadas'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Modo oscuro</span>
            <button
              onClick={() => handleToggle('darkModeEnabled')}
              className={`px-3 py-1 rounded ${settings.darkModeEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            >
              {settings.darkModeEnabled ? 'Activado' : 'Desactivado'}
            </button>
          </div>
          {/* Puedes agregar más configuraciones aquí */}
        </div>
      </div>
    </div>
  );
};

export default Settings;