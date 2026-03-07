import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiClient, setStoredAuthToken } from '../services/apiClient'
import { ENDPOINTS } from '../services/endpoints'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState<'TENANT' | 'PROPRIETOR'>('TENANT')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  })

  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})
  const [serverMessage, setServerMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validation = useMemo(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    return {
      fullName: formData.fullName.trim().length >= 2,
      email: emailValid,
      phoneNumber: /^[0-9+()\-\s]{8,20}$/.test(formData.phoneNumber.trim()),
      password: formData.password.length >= 8,
      confirmPassword: formData.password === formData.confirmPassword,
    }
  }, [formData])

  const isFormValid = Object.values(validation).every(Boolean)

  const isOfflineError = (message: string): boolean => {
    const normalized = message.toLowerCase()
    return normalized.includes('network')
      || normalized.includes('failed to fetch')
      || normalized.includes('connection refused')
      || normalized.includes('connect')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setServerMessage('')

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!validation.email) {
      setError('Please enter a valid email address')
      return
    }

    if (!validation.phoneNumber) {
      setError('Please enter a valid phone number')
      return
    }

    if (!validation.password) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!validation.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role,
      }

      const { data } = await apiClient.post(ENDPOINTS.auth.register, payload)

      setStoredAuthToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('userRole', data.role)

      setServerMessage(role === 'PROPRIETOR'
        ? 'Registration successful. Redirecting to owner dashboard...'
        : 'Registration successful. Redirecting to explore...')

      if (data.role === 'PROPRIETOR') {
        navigate('/dashboard/proprietor')
      } else {
        navigate('/explore')
      }
    } catch (caughtError: any) {
      const message = String(caughtError?.payload?.message || caughtError?.message || 'Network Error')
      console.error('Register API error:', caughtError)

      if (isOfflineError(message)) {
        setError('Server is currently offline')
      } else if (message.toLowerCase().includes('already')) {
        setError('Email already exists')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto mt-20 grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 gap-0 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <section className="relative hidden overflow-hidden rounded-l-3xl lg:block">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
            alt="Modern home"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/70 to-slate-800/45" />
          <div className="absolute bottom-12 left-12 max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-white">Find your space, build your future.</h2>
            <p className="mt-3 text-slate-200">Create your account and start renting or publishing premium listings on Maskan.</p>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl lg:rounded-l-none lg:rounded-r-3xl lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="mt-1 text-sm text-slate-200">Join Maskan today</p>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-900/55 p-1">
              <button
                type="button"
                onClick={() => setRole('TENANT')}
                className={`w-1/2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${role === 'TENANT' ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm' : 'border-white/35 bg-transparent text-slate-100 hover:border-indigo-300'}`}
              >
                I am a Tenant
              </button>
              <button
                type="button"
                onClick={() => setRole('PROPRIETOR')}
                className={`w-1/2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${role === 'PROPRIETOR' ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm' : 'border-white/35 bg-transparent text-slate-100 hover:border-indigo-300'}`}
              >
                I am a Proprietor
              </button>
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-400/60 bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</div>}
            {serverMessage && <div className="mb-4 rounded-xl border border-emerald-300/60 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">{serverMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-white">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, fullName: true }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${fieldTouched.fullName && !validation.fullName ? 'border-red-500 bg-white' : 'border-white/20 bg-white'}`}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-white">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, email: true }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${fieldTouched.email && !validation.email ? 'border-red-500 bg-white' : 'border-white/20 bg-white'}`}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-semibold text-white">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+212 600 000 000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, phoneNumber: true }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${fieldTouched.phoneNumber && !validation.phoneNumber ? 'border-red-500 bg-white' : 'border-white/20 bg-white'}`}
                />
              </div>

              {role === 'PROPRIETOR' && (
                <div>
                  <label htmlFor="companyName" className="mb-1.5 block text-sm font-semibold text-white">Agency / Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Your agency"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, password: true }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${fieldTouched.password && !validation.password ? 'border-red-500 bg-white' : 'border-white/20 bg-white'}`}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-white">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, confirmPassword: true }))}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-950 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${fieldTouched.confirmPassword && !validation.confirmPassword ? 'border-red-500 bg-white' : 'border-white/20 bg-white'}`}
                />
              </div>

              <button type="submit" className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-70" disabled={loading || !isFormValid}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-200">
              Already have an account?
              <Link to="/login" className="ml-2 font-semibold text-indigo-300 hover:text-indigo-200">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Register
