import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    // Simulate login
    setTimeout(() => {
      setLoading(false)
      // Mock successful login
      localStorage.setItem('user', JSON.stringify({ email, name: 'User' }))
      navigate('/')
    }, 500)
  }

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your Maskan account</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-remember">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button className="social-button google">
                <span>Google</span>
              </button>
              <button className="social-button facebook">
                <span>Facebook</span>
              </button>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account?
                <Link to="/register" className="register-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="login-image">
            <div className="image-content">
              <h2>Discover Amazing Places</h2>
              <p>Find your perfect stay and create unforgettable memories</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login
