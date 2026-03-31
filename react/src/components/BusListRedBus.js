import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { busAPI } from '../services/api';
import SearchBar from './SearchBar';
import './BusListRedBus.css';
import './LoadingSpinner.css';

const BusListRedBus = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({ origin: '', destination: '', travelDate: '' });
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    departureTime: 'all',
    busType: 'all'
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [buses, searchParams, sortBy, filters]);

  const fetchBuses = async () => {
    try {
      const response = await busAPI.getAll();
      setBuses(response.data);
      setFilteredBuses(response.data);
    } catch (err) {
      setError('Failed to load buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const applyFiltersAndSort = () => {
    let result = [...buses];

    // Apply search filters
    if (searchParams.origin) {
      result = result.filter(bus => 
        bus.origin.toLowerCase().includes(searchParams.origin.toLowerCase())
      );
    }
    if (searchParams.destination) {
      result = result.filter(bus => 
        bus.destination.toLowerCase().includes(searchParams.destination.toLowerCase())
      );
    }

    // Apply price filter
    result = result.filter(bus => 
      parseFloat(bus.price) >= filters.priceRange[0] && 
      parseFloat(bus.price) <= filters.priceRange[1]
    );

    // Apply departure time filter
    if (filters.departureTime !== 'all') {
      const time = filters.departureTime;
      result = result.filter(bus => {
        const [hours] = bus.start_time.split(':');
        if (time === 'morning') return parseInt(hours) >= 6 && parseInt(hours) < 12;
        if (time === 'afternoon') return parseInt(hours) >= 12 && parseInt(hours) < 18;
        if (time === 'evening') return parseInt(hours) >= 18 && parseInt(hours) < 24;
        if (time === 'night') return parseInt(hours) >= 0 && parseInt(hours) < 6;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'departure') return a.start_time.localeCompare(b.start_time);
      if (sortBy === 'arrival') return a.reach_time.localeCompare(b.reach_time);
      if (sortBy === 'duration') {
        const getDuration = (start, end) => {
          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);
          return (eh * 60 + em) - (sh * 60 + sm);
        };
        return getDuration(a.start_time, a.reach_time) - getDuration(b.start_time, b.reach_time);
      }
      return 0;
    });

    setFilteredBuses(result);
  };

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let minutes = (eh * 60 + em) - (sh * 60 + sm);
    if (minutes < 0) minutes += 24 * 60;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAvailableSeats = (bus) => {
    // This would need to be calculated from actual seat data
    return Math.floor(Math.random() * 20) + 5; // Placeholder
  };

  if (loading) {
    return (
      <div className="redbus-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="redbus-container">
      <SearchBar onSearch={handleSearch} />
      
      <div className="redbus-content">
        <div className="filters-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]})}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 10000]})}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Departure Time</h4>
            <div className="filter-options">
              <label><input type="radio" name="departure" value="all" checked={filters.departureTime === 'all'} onChange={(e) => setFilters({...filters, departureTime: e.target.value})} /> All</label>
              <label><input type="radio" name="departure" value="morning" checked={filters.departureTime === 'morning'} onChange={(e) => setFilters({...filters, departureTime: e.target.value})} /> Morning (6AM - 12PM)</label>
              <label><input type="radio" name="departure" value="afternoon" checked={filters.departureTime === 'afternoon'} onChange={(e) => setFilters({...filters, departureTime: e.target.value})} /> Afternoon (12PM - 6PM)</label>
              <label><input type="radio" name="departure" value="evening" checked={filters.departureTime === 'evening'} onChange={(e) => setFilters({...filters, departureTime: e.target.value})} /> Evening (6PM - 12AM)</label>
              <label><input type="radio" name="departure" value="night" checked={filters.departureTime === 'night'} onChange={(e) => setFilters({...filters, departureTime: e.target.value})} /> Night (12AM - 6AM)</label>
            </div>
          </div>
        </div>

        <div className="buses-main">
          <div className="sort-bar">
            <span>{filteredBuses.length} buses found</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Price: Low to High</option>
              <option value="departure">Departure Time</option>
              <option value="arrival">Arrival Time</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="no-buses">No buses found matching your criteria.</div>
          ) : (
            <div className="buses-list-redbus">
              {filteredBuses.map((bus, index) => {
                const availableSeats = getAvailableSeats(bus);
                const duration = calculateDuration(bus.start_time, bus.reach_time);
                const rating = (4 + Math.random()).toFixed(1);
                
                return (
                  <div key={bus.id} className="bus-card-redbus">
                    <div className="bus-card-left">
                      <div className="bus-operator">
                        <div className="operator-logo">🚌</div>
                        <div className="operator-info">
                          <h3>{bus.bus_name}</h3>
                          <div className="bus-rating">
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-value">{rating}</span>
                            <span className="reviews">({Math.floor(Math.random() * 100)} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bus-route-info">
                        <div className="route-time">
                          <div className="time">{bus.start_time}</div>
                          <div className="city">{bus.origin}</div>
                        </div>
                        <div className="route-duration">
                          <div className="duration">{duration}</div>
                          <div className="route-line"></div>
                        </div>
                        <div className="route-time">
                          <div className="time">{bus.reach_time}</div>
                          <div className="city">{bus.destination}</div>
                        </div>
                      </div>

                      <div className="bus-amenities">
                        {bus.features.split(',').slice(0, 4).map((feature, idx) => (
                          <span key={idx} className="amenity-tag">{feature.trim()}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bus-card-right">
                      <div className="bus-seats-info">
                        <div className="seats-available">{availableSeats} Seats Available</div>
                        <div className="seat-types">
                          <span className="seat-type available">Available</span>
                          <span className="seat-type booked">Booked</span>
                        </div>
                      </div>
                      <div className="bus-price">
                        <div className="price">₹{bus.price}</div>
                        <div className="price-label">per seat</div>
                      </div>
                      <Link to={`/bus/${bus.id}`} className="btn-select-seats">
                        Select Seats
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusListRedBus;
