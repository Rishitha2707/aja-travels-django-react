import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BusList from './components/BusList';
import BusListRedBus from './components/BusListRedBus';
import BusDetail from './components/BusDetail';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import AdminBuses from './components/AdminBuses';
import AdminBookings from './components/AdminBookings';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isStaff, setIsStaff] = useState(localStorage.getItem('isStaff') === 'true');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
    localStorage.setItem('isStaff', isStaff);
  }, [token, userId, isStaff]);

  const handleLogin = (newToken, newUserId, newIsStaff) => {
    setToken(newToken);
    setUserId(newUserId);
    setIsStaff(newIsStaff || false);
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    setIsStaff(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isStaff');
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} isStaff={isStaff} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={<BusListRedBus />} />
          <Route path="/buses-old" element={<BusList />} />
          <Route path="/bus/:id" element={<BusDetail token={token} userId={userId} />} />
          <Route path="/my-bookings" element={token ? <MyBookings token={token} userId={userId} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isStaff ? <AdminDashboard token={token} /> : <Navigate to="/" />} />
          <Route path="/admin/buses" element={isStaff ? <AdminBuses token={token} /> : <Navigate to="/" />} />
          <Route path="/admin/bookings" element={isStaff ? <AdminBookings token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
