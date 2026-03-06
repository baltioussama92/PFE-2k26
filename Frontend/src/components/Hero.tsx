import React, { useState } from 'react'
import './Hero.css'

const Hero: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const tags = ['Mountain Retreat', 'Nordic Charm', 'Cozy Cottage', 'Nature Escape']

  return (
    <section className="hero">
      {/* Floating Nav */}
      <header className="hero-header">
        <div className="hero-header-inner">
          <div className="hero-logo">M</div>
          <nav className="hero-nav-pill">
            <a href="#home" className="hero-nav-link active">Home</a>
            <a href="#about" className="hero-nav-link">About</a>
            <a href="#how" className="hero-nav-link">How it works</a>
            <a href="#pricing" className="hero-nav-link">Pricing</a>
          </nav>
          <div className="hero-header-right">
            <span className="hero-lang">EN</span>
            <span className="hero-phone">+62 (899) 536 6013</span>
          </div>
          <button
            className={`hero-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
        {menuOpen && (
          <div className="hero-mobile-nav">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          </div>
        )}
      </header>

      {/* Hero Body */}
      <div className="hero-body">
        <div className="hero-left">
          <span className="hero-badge">● Available Now</span>
          <h1 className="hero-title">Plan Your<br />Escape</h1>
        </div>
        <div className="hero-tags">
          {tags.map(tag => (
            <button key={tag} className="hero-tag">{tag}</button>
          ))}
        </div>
      </div>

      {/* Bottom Booking Bar */}
      <div className="hero-booking">
        <div className="booking-fields">
          <div className="booking-field">
            <label>From Date</label>
            <input type="date" defaultValue="2025-08-03" />
          </div>
          <div className="booking-divider" />
          <div className="booking-field">
            <label>To Date</label>
            <input type="date" defaultValue="2025-10-03" />
          </div>
          <div className="booking-divider" />
          <div className="booking-field">
            <label>Max Price</label>
            <input type="text" placeholder="$500 / night" />
          </div>
          <div className="booking-divider" />
          <div className="booking-field">
            <label>Phone Number</label>
            <input type="tel" placeholder="+7 (380) 60 561 60 69" />
          </div>
        </div>
        <button className="book-btn">Book a House ↗</button>
        <div className="hero-address">
          <p>971 Coolidge Street</p>
          <p>Rain Town, Montana</p>
          <p>59917</p>
        </div>
      </div>

      {/* Wave shape at bottom */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F8F7F4" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
