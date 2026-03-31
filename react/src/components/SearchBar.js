import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({ origin, destination, travelDate });
    }
  };

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-field">
            <label>From</label>
            <input
              type="text"
              placeholder="Enter origin city"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
          <button type="button" className="swap-btn" onClick={swapCities} title="Swap">
            ⇄
          </button>
          <div className="search-field">
            <label>To</label>
            <input
              type="text"
              placeholder="Enter destination city"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="search-field">
            <label>Date of Journey</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <button type="submit" className="search-btn">
            Search Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
