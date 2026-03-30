import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { DEMO_MODE, DEMO_CREDENTIALS } from '../../data/demo'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'authToken'
const USER_STORAGE_KEY = 'user'
const ROLE_STORAGE_KEY = 'userRole'

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-900">{title}</h2>
            <button type="button" onClick={onClose} className="rounded-md p-1 text-primary-600 hover:bg-primary-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <input
                type="text"
                value={form.fullName}
                onChange={updateField('fullName')}
                placeholder="Full name"
                className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
                required
              />
            )}

            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="Email"
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
              required
            />

            <input
              type="password"
              value={form.password}
              onChange={updateField('password')}
              placeholder="Password"
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
              required
            />

            {mode === 'register' && (
              <input
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="Phone (optional)"
                className="w-full rounded-lg border border-primary-200 px-3 py-2 text-sm"
              />
            )}

            {submitError && <p className="text-xs text-red-600">{submitError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setSubmitError('')
              setMode((prev) => (prev === 'login' ? 'register' : 'login'))
            }}
            className="mt-4 text-xs font-medium text-primary-700 hover:underline"
          >
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}