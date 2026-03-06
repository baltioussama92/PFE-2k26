import React, { useState } from 'react'
import './Header.css'

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>Maskan</h1>
          </div>
          <nav className="nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#product" className="nav-link">Product</a>
            <a href="#treatment" className="nav-link">Treatment</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          <button className="login-btn header-login">Login</button>
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#product" className="nav-link" onClick={() => setMenuOpen(false)}>Product</a>
        <a href="#treatment" className="nav-link" onClick={() => setMenuOpen(false)}>Treatment</a>
        <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
        <button className="login-btn">Login</button>
      </div>
    </header>
  )
}

export default Header
