import React from 'react'
import './Header.css'

const Header: React.FC = () => {
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
          <button className="login-btn">Login</button>
        </div>
      </div>
    </header>
  )
}

export default Header
