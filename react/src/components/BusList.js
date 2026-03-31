import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { busAPI } from '../services/api';
import './BusList.css';
import './LoadingSpinner.css';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await busAPI.getAll();
      setBuses(response.data);
    } catch (err) {
      setError('Failed to load buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading buses...</p>
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
        <h1>🚌 Available Buses</h1>
        <p>Choose your perfect journey</p>
      </div>
      {buses.length === 0 ? (
        <div className="card">No buses available at the moment.</div>
      ) : (
        <div className="bus-list">
          {buses.map((bus, index) => {
            // Generate colorful placeholder images if no image_url provided
            const busImage = bus.image_url || `https://images.unsplash.com/photo-${1500000000000 + index}?w=800&h=600&fit=crop&auto=format`;
            const colorGradients = [
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            ];
            const gradient = colorGradients[index % colorGradients.length];
            
            return (
            <div key={bus.id} className="card bus-card">
              <div className="bus-image-container" style={{background: gradient}}>
                <img 
                  src={busImage} 
                  alt={bus.bus_name}
                  className="bus-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="bus-image-placeholder" style={{display: 'none'}}>
                  <span className="bus-emoji">🚌</span>
                </div>
                <div className="bus-image-overlay">
                  <span className="bus-number">{bus.number}</span>
                </div>
              </div>
              <div className="bus-content">
                <div className="bus-header">
                  <h2>{bus.bus_name}</h2>
                </div>
                <div className="bus-route">
                  <span className="route-origin">{bus.origin}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-destination">{bus.destination}</span>
                </div>
              <div className="bus-details">
                <div className="detail-item">
                  <strong>Departure:</strong> {bus.start_time}
                </div>
                <div className="detail-item">
                  <strong>Arrival:</strong> {bus.reach_time}
                </div>
                <div className="detail-item">
                  <strong>Price:</strong> ₹{bus.price}
                </div>
                <div className="detail-item">
                  <strong>Seats:</strong> {bus.no_of_seats}
                </div>
              </div>
              <div className="bus-features">
                <strong>Features:</strong> {bus.features}
              </div>
              <Link to={`/bus/${bus.id}`} className="btn btn-primary">
                View Details & Book
              </Link>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
};

export default BusList;
