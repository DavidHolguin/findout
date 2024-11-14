import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import MenuBar from './components/MenuBar';
import Profile from './components/Profile';
import Settings from './components/Settings';
import CompanyCategory from './components/CompanyCategory';
import JoinFindoutPage from './components/JoinFindoutPage';
import QRScanner from './components/QRScanner';
import ShoppingCartComponent from './components/ShoppingCartComponent';
import IOSInstallGuide from './components/IOSInstallGuide'; // Add this importim
import DeliveryTracker from './components/DeliveryTracker';




function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  const orderData = {
    // Coordenadas del restaurante
    pickup_latitude: 40.4168, // Ejemplo: Madrid
    pickup_longitude: -3.7038,
    
    // Coordenadas del punto de entrega
    delivery_latitude: 40.4154,
    delivery_longitude: -3.7106,
    
    // Estado inicial del pedido
    status: 'pending', // Valores posibles: 'pending', 'pickup', 'in_transit', 'delivered', 'cancelled'
  };
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto pt-16 pb-14 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<CompanyList />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scanQR" element={<QRScanner />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/company-categories/:categoryId" element={<CompanyCategory />} />
            <Route path="/register-business" element={<JoinFindoutPage />} />
            <Route path="/download" element={<IOSInstallGuide />} /> 
         
            <Route path="/tracker" element={<DeliveryTracker 
  orderId="123" 
  initialOrder={orderData} 
/>} /> 
            <Route path="/cart/:companyId" element={<ShoppingCartComponent />} />     
          </Routes>
        </main>
        <MenuBar />
      </div>
    </Router>
  );
}

export default App;