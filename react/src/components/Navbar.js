import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, isStaff, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AJA Travels
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Buses
          </Link>
          {token ? (
            <>
              <Link to="/my-bookings" className="navbar-link">
                My Bookings
              </Link>
              {isStaff && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}
              <button onClick={onLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
