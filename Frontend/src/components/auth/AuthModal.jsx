import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { DEMO_MODE, DEMO_CREDENTIALS } from '../../data/demo'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'authToken'
const USER_STORAGE_KEY = 'user'
const ROLE_STORAGE_KEY = 'userRole'
const HOUSE_IMAGE_URL =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'

const formVariants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: 'easeOut',
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

const fieldVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const mapRole = (role) => {
  if (role === 'HOST') return 'PROPRIETOR'
  if (role === 'GUEST') return 'TENANT'
  if (role === 'PROPRIETAIRE') return 'PROPRIETOR'
  return role || 'TENANT'
}

const normalizeUser = (user, roleOverride) => ({
  id: user?.id,
  name: user?.fullName || user?.name || 'User',
  email: user?.email,
  role: mapRole(roleOverride || user?.role),
  username: user?.username || '',
  bio: user?.bio || '',
  avatar: user?.avatar || '',
})

const persistSession = (payload) => {
  if (payload?.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
  }
  if (payload?.user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload.user))
  }
  if (payload?.role || payload?.user?.role) {
    localStorage.setItem(ROLE_STORAGE_KEY, mapRole(payload.role || payload.user.role))
  }
}

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'login')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })

  const title = useMemo(() => (mode === 'login' ? 'Sign in' : 'Create account'), [mode])

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleLogin = async () => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const payload = {
        token: DEMO_CREDENTIALS.token,
        role: DEMO_CREDENTIALS.user.role,
        user: DEMO_CREDENTIALS.user,
      }
      persistSession(payload)
      onSuccess?.(normalizeUser(payload.user, payload.role))
      onClose?.()
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    const payload = await response.json()
    persistSession(payload)
    onSuccess?.(normalizeUser(payload.user, payload.role))
    onClose?.()
  }

  const handleRegister = async () => {
    if (DEMO_MODE) {
      setMode('login')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone,
      }),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    const payload = await response.json()
    if (payload?.token && payload?.user) {
      persistSession(payload)
      onSuccess?.(normalizeUser(payload.user, payload.role))
      onClose?.()
      return
    }

    setMode('login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await handleLogin()
      } else {
        await handleRegister()
      }
    } catch (error) {
      setSubmitError(error?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/65 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-primary-100/15 bg-primary-50 shadow-2xl lg:grid-cols-2"
          initial={{ y: 26, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <section className="relative hidden min-h-[560px] lg:block">
            <img src={HOUSE_IMAGE_URL} alt="Luxury house exterior" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/35 to-primary-700/10" />

            <motion.div
              className="absolute left-7 top-7 rounded-xl border border-primary-50/20 bg-primary-900/40 px-4 py-2 text-primary-50 backdrop-blur-sm"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-primary-100/80">Maskan Homes</p>
              <p className="mt-1 text-sm font-semibold">Trusted stays, smarter renting</p>
            </motion.div>

            <div className="absolute bottom-8 left-7 right-7 text-primary-50">
              <p className="text-3xl font-bold leading-tight">Live where your story feels right.</p>
              <p className="mt-3 text-sm text-primary-100/90">
                Sign in to manage bookings or create your account to discover homes tailored to your lifestyle.
              </p>
            </div>
          </section>

          <section className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">Welcome</p>
                <h2 className="mt-1 text-2xl font-bold text-primary-900">{title}</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-primary-200 bg-primary-50 p-2 text-primary-700 transition hover:-translate-y-0.5 hover:bg-primary-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6 inline-flex rounded-xl bg-primary-100/70 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-primary-600 text-primary-50 shadow-md' : 'text-primary-700 hover:text-primary-900'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-primary-600 text-primary-50 shadow-md' : 'text-primary-700 hover:text-primary-900'
                }`}
              >
                Sign up
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                className="space-y-3"
                onSubmit={handleSubmit}
                variants={formVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {mode === 'register' && (
                  <motion.input
                    variants={fieldVariants}
                    type="text"
                    value={form.fullName}
                    onChange={updateField('fullName')}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2.5 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                )}

                <motion.input
                  variants={fieldVariants}
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="Email"
                  className="w-full rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2.5 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  required
                />

                <motion.input
                  variants={fieldVariants}
                  type="password"
                  value={form.password}
                  onChange={updateField('password')}
                  placeholder="Password"
                  className="w-full rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2.5 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  required
                />

                {mode === 'register' && (
                  <motion.input
                    variants={fieldVariants}
                    type="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder="Phone (optional)"
                    className="w-full rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2.5 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                )}

                {submitError && <p className="pt-1 text-xs font-medium text-red-600">{submitError}</p>}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  animate={!loading ? { y: [0, -1.2, 0] } : { y: 0 }}
                  transition={!loading ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                  className="mt-2 w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-primary-50 shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => {
                setSubmitError('')
                setMode((prev) => (prev === 'login' ? 'register' : 'login'))
              }}
              className="mt-4 text-xs font-semibold text-primary-700 transition hover:text-primary-900 hover:underline"
            >
              {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
            </button>
          </section>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}