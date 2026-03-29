import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Briefcase } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Briefcase className="logo-icon" size={28} />
          <span>Freelance<span className="text-primary">Fuze</span></span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Explore</Link>
          
          {isAuthenticated ? (
            <>
              {user.role === 'VENDOR' && (
                <Link to="/vendor/dashboard" className="nav-link">My Gigs</Link>
              )}
              {user.role === 'CLIENT' && (
                <Link to="/client/dashboard" className="nav-link">My Orders</Link>
              )}
              
              <div className="nav-user-profile">
                <span className="nav-user-name">Hi, {user.name}</span>
                <button className="nav-icon-btn" onClick={handleLogout} title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="nav-actions">
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
