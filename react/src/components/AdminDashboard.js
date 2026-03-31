import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = ({ token }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-nav">
          <Link to="/admin/buses" className="btn btn-primary">Manage Buses</Link>
          <Link to="/admin/bookings" className="btn btn-primary">View All Bookings</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Buses</h3>
          <p className="stat-number">{dashboard?.total_buses || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{dashboard?.total_bookings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{dashboard?.total_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{dashboard?.total_revenue?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Bookings</h2>
        {dashboard?.recent_bookings?.length === 0 ? (
          <p>No recent bookings</p>
        ) : (
          <div className="recent-bookings">
            {dashboard?.recent_bookings?.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <strong>{booking.bus.bus_name}</strong>
                  <span>{booking.bus.origin} → {booking.bus.destination}</span>
                  <span>Seat: {booking.seat.seat_number}</span>
                  <span>User: {booking.user}</span>
                </div>
                <div className="booking-time">
                  {new Date(booking.booking_time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
