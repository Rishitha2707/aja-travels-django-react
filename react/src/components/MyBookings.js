import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import './MyBookings.css';
import './LoadingSpinner.css';

const MyBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(userId);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🎫 My Bookings</h1>
        <p>Your travel history</p>
      </div>
      {bookings.length === 0 ? (
        <div className="card">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="card booking-card">
              <div className="booking-header">
                <h2>{booking.bus.bus_name}</h2>
                <span className="booking-id">Booking #{booking.id}</span>
              </div>
              <div className="booking-route">
                <span>{booking.bus.origin}</span>
                <span className="route-arrow">→</span>
                <span>{booking.bus.destination}</span>
              </div>
              <div className="booking-details">
                <div className="detail-row">
                  <strong>Bus Number:</strong> {booking.bus.number}
                </div>
                <div className="detail-row">
                  <strong>Seat Number:</strong> {booking.seat.seat_number}
                </div>
                <div className="detail-row">
                  <strong>Departure:</strong> {booking.bus.start_time}
                </div>
                <div className="detail-row">
                  <strong>Arrival:</strong> {booking.bus.reach_time}
                </div>
                <div className="detail-row">
                  <strong>Price:</strong> ₹{booking.bus.price}
                </div>
                <div className="detail-row">
                  <strong>Booking Date:</strong>{' '}
                  {new Date(booking.booking_time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
