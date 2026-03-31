import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './AdminBookings.css';

const AdminBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading bookings...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>All Bookings</h1>
        <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="bookings-table">
        {bookings.length === 0 ? (
          <div className="card">No bookings found.</div>
        ) : (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Bus</th>
                  <th>Route</th>
                  <th>Seat</th>
                  <th>Price</th>
                  <th>Booking Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.user}</td>
                    <td>{booking.bus.bus_name} ({booking.bus.number})</td>
                    <td>{booking.bus.origin} → {booking.bus.destination}</td>
                    <td>{booking.seat.seat_number}</td>
                    <td>₹{booking.bus.price}</td>
                    <td>{new Date(booking.booking_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
