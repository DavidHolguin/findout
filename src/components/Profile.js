import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Key, LogOut, AlertTriangle, Settings, Shield } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });
  const navigate = useNavigate();

  const API_URL = 'https://backendfindout-ea692e018a66.herokuapp.com/api/login/';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Token ${token}`
        }
      };

      const response = await axios.get(API_URL, config);
      setUser(response.data);
      setEditForm({
        username: response.data.username,
        email: response.data.email
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los datos');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Token ${token}`
        }
      };
      
      await axios.delete(API_URL, config);
      localStorage.removeItem('token');
      setShowDeleteConfirm(false);
      navigate('/register');
    } catch (err) {
      setError('Error al eliminar la cuenta: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Token ${token}`
        }
      };

      const response = await axios.put(API_URL, editForm, config);
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Error al actualizar el perfil: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-xl rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-600">ID: {user.user_id}</p>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-lg rounded-lg">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings size={20} />
                Información Personal
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({username: user.username, email: user.email});
                      }}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-500" size={20} />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Editar Información
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Seguridad */}
          <div className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-lg rounded-lg">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield size={20} />
                Seguridad
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Key className="text-gray-500" size={20} />
                <span>Cambiar contraseña</span>
              </div>
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Actualizar Seguridad
              </button>
            </div>
          </div>
        </div>

        {/* Acciones de Cuenta */}
        <div className="backdrop-blur-lg bg-white/80 border border-white/20 shadow-lg rounded-lg">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-red-500">Acciones de Cuenta</h3>
          </div>
          <div className="p-4 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <AlertTriangle size={20} />
              Eliminar Cuenta
            </button>
          </div>
        </div>

        {/* Modal de Confirmación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Confirmar eliminación</h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;