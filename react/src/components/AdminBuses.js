import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './AdminBuses.css';

const AdminBuses = ({ token }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    bus_name: '',
    number: '',
    origin: '',
    destination: '',
    features: '',
    no_of_seats: '',
    start_time: '',
    reach_time: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await adminAPI.getAllBuses();
      setBuses(response.data);
    } catch (err) {
      setError('Failed to load buses.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingBus) {
        await adminAPI.updateBus(editingBus.id, formData);
      } else {
        await adminAPI.createBus(formData);
      }
      setShowForm(false);
      setEditingBus(null);
      setFormData({
        bus_name: '',
        number: '',
        origin: '',
        destination: '',
        features: '',
        no_of_seats: '',
        start_time: '',
        reach_time: '',
        price: ''
      });
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save bus.');
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      bus_name: bus.bus_name,
      number: bus.number,
      origin: bus.origin,
      destination: bus.destination,
      features: bus.features,
      no_of_seats: bus.no_of_seats,
      start_time: bus.start_time,
      reach_time: bus.reach_time,
      price: bus.price,
      image_url: bus.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await adminAPI.deleteBus(id);
        fetchBuses();
      } catch (err) {
        setError('Failed to delete bus.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBus(null);
    setFormData({
      bus_name: '',
      number: '',
      origin: '',
      destination: '',
      features: '',
      no_of_seats: '',
      start_time: '',
      reach_time: '',
      price: '',
      image_url: ''
    });
  };

  if (loading) {
    return <div className="container">Loading buses...</div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Manage Buses</h1>
        <div>
          <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginLeft: '10px' }}>
            {showForm ? 'Cancel' : 'Add New Bus'}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Bus Name</label>
                <input
                  type="text"
                  name="bus_name"
                  value={formData.bus_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bus Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reach Time</label>
                <input
                  type="time"
                  name="reach_time"
                  value={formData.reach_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Number of Seats</label>
                <input
                  type="number"
                  name="no_of_seats"
                  value={formData.no_of_seats}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
              <div className="form-group">
                <label>Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/bus-image.jpg"
                />
                <small style={{color: '#667eea', fontSize: '12px', marginTop: '5px', display: 'block'}}>
                  Leave empty to use colorful placeholder
                </small>
              </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingBus ? 'Update Bus' : 'Create Bus'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="buses-list">
        {buses.length === 0 ? (
          <div className="card">No buses found.</div>
        ) : (
          buses.map((bus, index) => {
            const busImage = bus.image_url || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop&auto=format`;
            const colorGradients = [
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            ];
            const gradient = colorGradients[index % colorGradients.length];
            
            return (
            <div key={bus.id} className="card bus-card">
              <div className="admin-bus-image" style={{background: gradient}}>
                <img 
                  src={busImage} 
                  alt={bus.bus_name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="bus-header">
                <h2>{bus.bus_name}</h2>
                <span className="bus-number">{bus.number}</span>
              </div>
              <div className="bus-details">
                <div><strong>Route:</strong> {bus.origin} → {bus.destination}</div>
                <div><strong>Time:</strong> {bus.start_time} - {bus.reach_time}</div>
                <div><strong>Seats:</strong> {bus.no_of_seats}</div>
                <div><strong>Price:</strong> ₹{bus.price}</div>
                <div><strong>Features:</strong> {bus.features}</div>
              </div>
              <div className="bus-actions">
                <button onClick={() => handleEdit(bus)} className="btn btn-primary">
                  Edit
                </button>
                <button onClick={() => handleDelete(bus.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};

export default AdminBuses;
