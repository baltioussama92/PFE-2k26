import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>About</h4>
          <Link to="/">About Maskan</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Press</Link>
          <Link to="/">Blog</Link>
        </div>

        <div className="footer-column">
          <h4>Community</h4>
          <Link to="/">Become a Host</Link>
          <Link to="/">Community Guidelines</Link>
          <Link to="/">Safety</Link>
          <Link to="/">Support</Link>
        </div>

        <div className="footer-column">
          <h4>Hosting</h4>
          <Link to="/add-property">List your property</Link>
          <Link to="/">Host resources</Link>
          <Link to="/">Community forum</Link>
          <Link to="/">Host protection</Link>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <p>Email: hello@maskan.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Main Street, City, Country</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Maskan. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
          <Link to="/">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
