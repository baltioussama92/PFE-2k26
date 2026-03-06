import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState('EN')

  return (
    <nav className="navbar">
      <div className="navbar-shell">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">Maskan</Link>

        <button
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>

        <div className={`navbar-menu${menuOpen ? ' active' : ''}`}>
          <Link to="/" className="navbar-link">Home</Link>
          <a href="/#about-house" className="navbar-link">About</a>
          <Link to="/search" className="navbar-link">Explore</Link>
          <a href="/#contact" className="navbar-link">Contact</a>
        </div>

        <div className="navbar-right">
          <select
            className="navbar-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Language"
          >
            <option value="EN">EN</option>
            <option value="FR">FR</option>
            <option value="AR">AR</option>
          </select>
          <Link to="/login" className="navbar-button navbar-button-outline">Login</Link>
          <Link to="/register" className="navbar-button navbar-button-primary">Sign Up</Link>
        </div>
      </div>
      </div>
    </nav>
  )
}

export default Navbar
