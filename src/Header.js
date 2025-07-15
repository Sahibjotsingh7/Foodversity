import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from './images/foodversity-high-resolution-logo-transparent.png';
import './Styles/header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Determine header class based on route
  const getHeaderClass = () => {
    switch (location.pathname) {
      case '/upload':
        return 'header orange-gradient';
      case '/dashboard':
        return 'header green-gradient';
      case '/':
      case '/main':
      case '/explore':
      default:
        return 'header purple-gradient';
    }
  };

  return (
    <header className={getHeaderClass()}>
      {/* Left section (Logo + Navigation) */}
      <div className="left-section">
        <div className="logo-container">
          <img src={logo} alt="Foodversity Logo" className="logo-image" />
        </div>
        {/* Navigation Links */}
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/upload" className="nav-link" onClick={() => setMenuOpen(false)}>
            Upload+
          </Link>
        </nav>
      </div>

      {/* Right section (Buttons) */}
      <div className="button-container">
        <Link to="/upload">
          <button className="start-trial-button">Start Free Trial</button>
        </Link>
      </div>

      {/* Hamburger menu for mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </div>
    </header>
  );
};

export default Header;