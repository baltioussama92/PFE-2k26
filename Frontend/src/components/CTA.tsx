import React from 'react'
import './CTA.css'

const CTA: React.FC = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <div className="cta-text">
            <h2>Why you waiting for?</h2>
            <p>Download Housan now!</p>
          </div>
          <div className="cta-buttons">
            <button className="cta-btn app-store">
              <span>📱</span> App Store
            </button>
            <button className="cta-btn play-store">
              <span>▶</span> Play Store
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
