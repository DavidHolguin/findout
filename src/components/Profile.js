import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Aquí deberías hacer una llamada a tu API para obtener los datos del usuario
      // Por ahora, simularemos datos del usuario
      setUser({
        username: 'usuario_ejemplo',
        email: 'usuario@ejemplo.com',
        // Otros datos del perfil...
      });
    }
  }, [navigate]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <User size={64} className="text-gray-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        {/* Aquí puedes agregar más información del perfil */}
      </div>
    </div>
  );
};

export default Profile;