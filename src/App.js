// src/App.js
import React from 'react';
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


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<CompanyList />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <MenuBar />
      </div>
    </Router>
  );
}

export default App;