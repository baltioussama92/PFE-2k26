import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { authService } from '../services/authService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[0-9+()\-\s]{8,20}$/
const BIRTH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const BIRTH_DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1))
const CURRENT_YEAR = new Date().getFullYear()
const BIRTH_YEARS = Array.from({ length: 100 }, (_, index) => String(CURRENT_YEAR - index))

const formVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 42 : -42 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -42 : 42 }),
}

const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

const initialRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthMonth: '',
  birthDay: '',
  birthYear: '',
  gender: '',
  agencyName: '',
}

const initialLogin = {
  email: '',
  password: '',
}

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const initialMode = location.pathname === '/register' ? 'register' : 'login'

  const [mode, setMode] = useState(initialMode)
  const [direction, setDirection] = useState(1)
  const [selectedRole, setSelectedRole] = useState('TENANT')
  const [isLoading, setIsLoading] = useState(false)
  const [registerData, setRegisterData] = useState(initialRegister)
  const [loginData, setLoginData] = useState(initialLogin)
  const [touched, setTouched] = useState({})
  const [didSubmit, setDidSubmit] = useState(false)

  useEffect(() => {
    const nextMode = location.pathname === '/register' ? 'register' : 'login'
    if (nextMode !== mode) {
      setDirection(nextMode === 'register' ? 1 : -1)
      setMode(nextMode)
      setTouched({})
      setDidSubmit(false)
    }
  }, [location.pathname, mode])

  const registerErrors = useMemo(() => {
    return {
      firstName: registerData.firstName.trim().length < 2,
      lastName: registerData.lastName.trim().length < 2,
      email: !EMAIL_REGEX.test(registerData.email.trim()),
      password: registerData.password.length < 8,
      birthMonth: registerData.birthMonth.trim() === '',
      birthDay: registerData.birthDay.trim() === '',
      birthYear: registerData.birthYear.trim() === '',
      gender: registerData.gender.trim() === '',
    }
  }, [registerData])

  const loginErrors = useMemo(() => {
    return {
      email: !EMAIL_REGEX.test(loginData.email.trim()),
      password: loginData.password.length < 8,
    }
  }, [loginData])

  const isRegisterValid = useMemo(
    () => Object.values(registerErrors).every((hasError) => !hasError),
    [registerErrors],
  )

  const isLoginValid = useMemo(
    () => Object.values(loginErrors).every((hasError) => !hasError),
    [loginErrors],
  )

  const showFieldError = (field, hasError) => (didSubmit || touched[field]) && hasError

  const inputClass = (isError) => [
    'w-full rounded-xl border bg-primary-50/70 px-4 py-3 text-sm text-primary-900 placeholder:text-primary-400',
    'outline-none transition-all duration-200 focus:bg-primary-100',
    isError
      ? 'border-red-400 ring-2 ring-red-200 focus:border-red-500'
      : 'border-primary-200/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
  ].join(' ')

  const switchMode = (nextMode) => {
    if (nextMode === mode) return

    setDirection(nextMode === 'register' ? 1 : -1)
    setMode(nextMode)
    setTouched({})
    setDidSubmit(false)
    navigate(nextMode === 'register' ? '/register' : '/login')
  }

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleAuth = async (event) => {
    event.preventDefault()
    setDidSubmit(true)

    if (mode === 'register' && !isRegisterValid) {
      toast.error('Please correct the highlighted fields.')
      return
    }

    if (mode === 'login' && !isLoginValid) {
      toast.error('Please provide a valid email and password.')
      return
    }

    try {
      setIsLoading(true)

      if (mode === 'register') {
        const fullName = `${registerData.firstName} ${registerData.lastName}`.trim()
        await authService.register({
          fullName,
          email: registerData.email.trim().toLowerCase(),
          password: registerData.password,
          role: selectedRole,
          agencyName: selectedRole === 'PROPRIETOR' ? registerData.agencyName.trim() : undefined,
        })
      } else {
        await authService.login({
          email: loginData.email.trim().toLowerCase(),
          password: loginData.password,
        })
      }

      toast.success(mode === 'register' ? 'Account created successfully.' : 'Welcome back.')
      navigate('/explorer', { replace: true })
    } catch (error) {
      const message =
        error?.payload?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Authentication failed.'

      const normalizedMessage = String(message).toLowerCase()

      if (normalizedMessage.includes('already')) {
        toast.error('Email already exists')
      } else if (normalizedMessage.includes('invalid')) {
        toast.error('Invalid Credentials')
      } else {
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-900 lg:grid lg:grid-cols-2">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <section className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Modern home"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/85 via-primary-800/60 to-primary-700/45" />
        <div className="absolute bottom-14 left-14 max-w-md">
          <p className="text-4xl font-bold leading-tight text-primary-50">
            Find your space, build your future.
          </p>
          <p className="mt-4 text-base text-primary-100">
            Secure rentals, seamless booking, and a premium experience built for tenants and proprietors.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[radial-gradient(circle_at_top_right,rgba(164,131,116,0.22),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(203,173,141,0.18),transparent_40%)]">
        <div className="w-full max-w-xl rounded-3xl border border-primary-200/35 bg-primary-50/20 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link to="/" className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 hover:text-primary-500">
              Back to Home
            </Link>
            <div className="rounded-xl bg-primary-50/50 p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-primary-100 text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-700'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-primary-100 text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-700'}`}
              >
                Register
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.form
              key={mode}
              custom={direction}
              variants={formVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              onSubmit={handleAuth}
              className="space-y-5"
            >
              {mode === 'register' ? (
                <>
                  <motion.div variants={staggerParent} initial="hidden" animate="visible" className="space-y-4">
                    <motion.div variants={staggerItem}>
                      <div className="mb-2 rounded-xl bg-primary-50/60 p-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('TENANT')}
                          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${selectedRole === 'TENANT' ? 'bg-primary-500 text-primary-50' : 'text-primary-700 hover:text-primary-900'}`}
                        >
                          I am a Tenant
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('PROPRIETOR')}
                          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-semibold transition ${selectedRole === 'PROPRIETOR' ? 'bg-primary-500 text-primary-50' : 'text-primary-700 hover:text-primary-900'}`}
                        >
                          I am a Proprietor
                        </button>
                      </div>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          value={registerData.firstName}
                          onBlur={() => markTouched('firstName')}
                          onChange={(event) => setRegisterData((current) => ({ ...current, firstName: event.target.value }))}
                          placeholder="First name"
                          className={inputClass(showFieldError('firstName', registerErrors.firstName))}
                        />
                        <input
                          type="text"
                          value={registerData.lastName}
                          onBlur={() => markTouched('lastName')}
                          onChange={(event) => setRegisterData((current) => ({ ...current, lastName: event.target.value }))}
                          placeholder="Last name"
                          className={inputClass(showFieldError('lastName', registerErrors.lastName))}
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="mb-1.5 block text-sm font-medium text-primary-700">Mobile number or email</label>
                      <input
                        type="email"
                        value={registerData.email}
                        onBlur={() => markTouched('registerEmail')}
                        onChange={(event) => setRegisterData((current) => ({ ...current, email: event.target.value }))}
                        placeholder="Mobile number or email"
                        className={inputClass(showFieldError('registerEmail', registerErrors.email))}
                      />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="mb-1.5 block text-sm font-medium text-primary-700">New password</label>
                      <input
                        type="password"
                        value={registerData.password}
                        onBlur={() => markTouched('registerPassword')}
                        onChange={(event) => setRegisterData((current) => ({ ...current, password: event.target.value }))}
                        placeholder="New password"
                        className={inputClass(showFieldError('registerPassword', registerErrors.password))}
                      />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="mb-1.5 block text-sm font-medium text-primary-700">Birthday</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={registerData.birthMonth}
                          onBlur={() => markTouched('birthMonth')}
                          onChange={(event) => setRegisterData((current) => ({ ...current, birthMonth: event.target.value }))}
                          className={inputClass(showFieldError('birthMonth', registerErrors.birthMonth))}
                        >
                          <option value="">Month</option>
                          {BIRTH_MONTHS.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={registerData.birthDay}
                          onBlur={() => markTouched('birthDay')}
                          onChange={(event) => setRegisterData((current) => ({ ...current, birthDay: event.target.value }))}
                          className={inputClass(showFieldError('birthDay', registerErrors.birthDay))}
                        >
                          <option value="">Day</option>
                          {BIRTH_DAYS.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <select
                          value={registerData.birthYear}
                          onBlur={() => markTouched('birthYear')}
                          onChange={(event) => setRegisterData((current) => ({ ...current, birthYear: event.target.value }))}
                          className={inputClass(showFieldError('birthYear', registerErrors.birthYear))}
                        >
                          <option value="">Year</option>
                          {BIRTH_YEARS.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="mb-2 block text-sm font-medium text-primary-700">Gender</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Female', 'Male'].map((genderOption) => (
                          <label
                            key={genderOption}
                            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                              registerData.gender === genderOption
                                ? 'border-primary-500 bg-primary-100 text-primary-900'
                                : 'border-primary-200 bg-primary-50/70 text-primary-700 hover:border-primary-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={genderOption}
                              checked={registerData.gender === genderOption}
                              onChange={(event) => {
                                markTouched('gender')
                                setRegisterData((current) => ({ ...current, gender: event.target.value }))
                              }}
                              className="h-4 w-4 accent-primary-600"
                            />
                            {genderOption}
                          </label>
                        ))}
                      </div>
                      {showFieldError('gender', registerErrors.gender) && (
                        <p className="mt-1 text-xs text-red-600">Please select a gender.</p>
                      )}
                    </motion.div>

                    {selectedRole === 'PROPRIETOR' && (
                      <motion.div variants={staggerItem}>
                        <label className="mb-1.5 block text-sm font-medium text-primary-700">Agency / Company Name (Optional)</label>
                        <input
                          type="text"
                          value={registerData.agencyName}
                          onChange={(event) => setRegisterData((current) => ({ ...current, agencyName: event.target.value }))}
                          placeholder="Your agency"
                          className={inputClass(false)}
                        />
                      </motion.div>
                    )}

                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    animate={isRegisterValid && !isLoading ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={isRegisterValid && !isLoading ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-primary-50 shadow-lg shadow-primary-500/25 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? <Spinner /> : 'Create Account'}
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div variants={staggerParent} initial="hidden" animate="visible" className="space-y-4">
                    <motion.div variants={staggerItem}>
                      <label className="mb-1.5 block text-sm font-medium text-primary-700">Email</label>
                      <input
                        type="email"
                        value={loginData.email}
                        onBlur={() => markTouched('loginEmail')}
                        onChange={(event) => setLoginData((current) => ({ ...current, email: event.target.value }))}
                        placeholder="you@example.com"
                        className={inputClass(showFieldError('loginEmail', loginErrors.email))}
                      />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium text-primary-700">Password</label>
                        <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                          Forgot Password?
                        </a>
                      </div>
                      <input
                        type="password"
                        value={loginData.password}
                        onBlur={() => markTouched('loginPassword')}
                        onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))}
                        placeholder="Your password"
                        className={inputClass(showFieldError('loginPassword', loginErrors.password))}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-primary-50 shadow-lg shadow-primary-500/25 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? <Spinner /> : 'Login'}
                  </motion.button>
                </>
              )}
            </motion.form>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

const Spinner = () => (
  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200/40 border-t-primary-100" />
)

export default AuthPage
