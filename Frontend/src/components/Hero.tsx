import React from 'react'
import './Hero.css'

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="hero-title">Find Real Estate and Get Your Dream Space</h2>
            <p className="hero-description">
              Rent comfortable and beautiful houses in the best locations
            </p>
          </div>
          <div className="hero-image">
            <div className="property-card">
              <div className="property-image">
                <img src="/hero-property.png" alt="Featured Property" className="hero-img" />
              </div>
              <div className="property-info">
                <h3>Black Modern House</h3>
                <p className="location">📍 New York Street 1260</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
