import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busAPI, bookingAPI } from '../services/api';
import './BusDetail.css';
import './LoadingSpinner.css';
import './SeatMapLegend.css';

const BusDetail = ({ token, userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBusDetails();
    fetchSeats();
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      const response = await busAPI.getById(id);
      setBus(response.data);
    } catch (err) {
      setError('Failed to load bus details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await busAPI.getSeats(id);
      setSeats(response.data);
    } catch (err) {
      setError('Failed to load seats.');
    }
  };

  const handleSeatSelect = (seat) => {
    if (!seat.is_booked && token) {
      setSelectedSeat(seat.id);
      setError('');
    } else if (!token) {
      setError('Please login to book a seat.');
    }
  };

  const handleBooking = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!selectedSeat) {
      setError('Please select a seat.');
      return;
    }

    setBooking(true);
    setError('');
    setSuccess('');

    try {
      await bookingAPI.create({ seat: selectedSeat });
      setSuccess('Seat booked successfully!');
      setSelectedSeat(null);
      fetchSeats();
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return <div className="container error">Bus not found.</div>;
  }

  // Generate colorful placeholder if no image
  const busImage = bus.image_url || `https://images.unsplash.com/photo-${1500000000000 + bus.id}?w=1200&h=600&fit=crop&auto=format`;
  const colorGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];
  const gradient = colorGradients[bus.id % colorGradients.length];

  return (
    <div className="container">
      <div className="page-header">
        <h1>🚌 Bus Details</h1>
        <p>Select your seat and book now</p>
      </div>
      <div className="card bus-detail-card">
        <div className="bus-detail-image-container" style={{background: gradient}}>
          <img 
            src={busImage} 
            alt={bus.bus_name}
            className="bus-detail-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="bus-image-placeholder" style={{display: 'none'}}>
            <span className="bus-emoji">🚌</span>
          </div>
          <div className="bus-detail-overlay">
            <h1>{bus.bus_name}</h1>
            <span className="bus-number">{bus.number}</span>
          </div>
        </div>
        <div className="bus-detail-content">
          <div className="bus-route">
            <span className="route-origin">{bus.origin}</span>
            <span className="route-arrow">→</span>
            <span className="route-destination">{bus.destination}</span>
          </div>
        <div className="bus-info">
          <div className="info-item">
            <strong>Departure Time:</strong> {bus.start_time}
          </div>
          <div className="info-item">
            <strong>Arrival Time:</strong> {bus.reach_time}
          </div>
          <div className="info-item">
            <strong>Price:</strong> ₹{bus.price}
          </div>
          <div className="info-item">
            <strong>Total Seats:</strong> {bus.no_of_seats}
          </div>
        </div>
          <div className="bus-features">
            <strong>Features:</strong> {bus.features}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <h2 style={{color: '#d84e55', marginBottom: '10px'}}>Select Your Seat</h2>
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box booked"></div>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-box selected"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
        {!token && (
          <div className="error">
            Please <a href="/login">login</a> to book a seat.
          </div>
        )}
        <div className="seat-grid">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`seat ${
                seat.is_booked
                  ? 'booked'
                  : selectedSeat === seat.id
                  ? 'selected'
                  : 'available'
              }`}
              onClick={() => handleSeatSelect(seat)}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
        {selectedSeat && token && (
          <div className="booking-section">
            <p>Selected Seat: {seats.find((s) => s.id === selectedSeat)?.seat_number}</p>
            <button
              onClick={handleBooking}
              className="btn btn-success"
              disabled={booking}
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
};

export default BusDetail;
