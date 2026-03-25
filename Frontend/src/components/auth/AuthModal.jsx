import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Eye, EyeOff, Mail, Lock, User, Phone,
  Building2, Home, ArrowRight, CheckCircle2, Loader2
} from 'lucide-react'

// ── Left panel quotes ─────────────────────────────────────────
const QUOTES = [
  {
    text: `"Maskan ne vend pas des murs — il vend la promesse d'un chez-soi."`,
    author: 'Yasmine Belaid, Fondatrice',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=90',
  },
  {
    text: `"Chaque bonne propriété mérite un bon propriétaire – et chaque famille mérite un foyer digne."`,

    author: 'Karim Trabelsi, CTO',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=90',
  },
]

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'authToken'
const USER_STORAGE_KEY = 'user'
const ROLE_STORAGE_KEY = 'userRole'

// Map backend roles (HOST/GUEST) to frontend roles (PROPRIETOR/TENANT)
const mapRole = (role) => {
  if (role === 'HOST') return 'PROPRIETOR'
  if (role === 'GUEST') return 'TENANT'
  if (role === 'PROPRIETAIRE') return 'PROPRIETOR'
  return role || 'TENANT'
}

const normalizeUser = (user, fallbackRole) => ({
  id: user?.id,
  name: user?.fullName || user?.name || 'User',
  email: user?.email,
  role: mapRole(user?.role || fallbackRole),
})

const persistSession = (authResponse) => {
  localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authResponse.user))
  localStorage.setItem(ROLE_STORAGE_KEY, authResponse.role)
}

const getErrorMessage = async (response, fallback) => {
  try {
    const payload = await response.json()
    if (payload?.message) {
      return payload.message
    }
  } catch {
    // Ignore JSON parse errors and use fallback message.
  }

  return fallback
}

const fieldBaseClass = 'w-full rounded-xl border border-primary-200 bg-primary-100 px-4 py-3 text-sm text-primary-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200'

// ── Input field helper ────────────────────────────────────────
function Field({ label, type = 'text', icon: Icon, placeholder, value, onChange, error, toggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-primary-500">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldBaseClass} pl-10 ${toggle ? 'pr-10' : ''} ${
            error ? 'border-red-400 focus:ring-red-300' : ''
          }`}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-500
                       transition-colors duration-150"
          >
            {type === 'password' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// ── Role Selector with Slider ────────────────────────────────
function RoleSelector({ role, setRole }) {
  const roles = [
    { id: 'TENANT',       label: 'Locataire', icon: Home,      desc: 'Je cherche un logement' },
    { id: 'PROPRIETAIRE', label: 'Propriétaire', icon: Building2, desc: 'Je gère des biens'     },
  ]

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Je suis un(e)</span>
      <div className="relative flex bg-primary-50 rounded-2xl p-1 gap-1">
        {/* Sliding background */}
        <motion.div
          layoutId="role-slider"
          className="absolute top-1 bottom-1 rounded-xl bg-primary-100 shadow-md"
          style={{
            width:  'calc(50% - 6px)',
            left:   role === 'TENANT' ? '4px' : 'calc(50% + 2px)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        />
        {roles.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => setRole(id)}
            className={`relative z-10 flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        transition-colors duration-200 ${
                          role === id ? 'text-primary-700' : 'text-primary-500 hover:text-primary-700'
                        }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              role === id ? 'bg-primary-100' : 'bg-primary-100/40'
            }`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-none">{label}</p>
              <p className="text-[10px] text-primary-400 mt-0.5 font-medium leading-none">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Login Form ────────────────────────────────────────────────
function LoginForm({ onSwitch, onClose, onSuccess }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e = {}
    if (!email.trim())           e.email    = 'L\'adresse email est requise'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide'
    if (password.length < 6)     e.password = 'Mot de passe trop court (min. 6 car.)'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setErrors({})
    setSubmitError('')
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Compte introuvable ou mot de passe invalide.')
        throw new Error(message)
      }

      const authResponse = await response.json()

      persistSession(authResponse)

      setSuccess(true)
      await new Promise((r) => setTimeout(r, 700))
      onSuccess?.(normalizeUser(authResponse.user, authResponse.role))
      onClose?.()
    } catch (error) {
      setSubmitError(error.message || 'Echec de la connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-extrabold text-primary-900">Bon retour ! 👋</h2>
        <p className="text-sm text-primary-500 mt-1">Connectez-vous à votre compte Maskan</p>
      </div>

      <Field
        label="Adresse email" icon={Mail}
        placeholder="vous@exemple.com" value={email}
        onChange={setEmail} error={errors.email}
      />
      <Field
        label="Mot de passe" icon={Lock} type={showPwd ? 'text' : 'password'}
        placeholder="Votre mot de passe" value={password}
        onChange={setPassword} error={errors.password}
        toggle={() => setShowPwd((v) => !v)}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded text-primary-500 accent-primary-500" />
          <span className="text-xs text-primary-700">Se souvenir de moi</span>
        </label>
        <button type="button" className="text-xs font-semibold text-primary-600 hover:underline">
          Mot de passe oublié ?
        </button>
      </div>

      <motion.button
        type="submit"
        whileHover={!loading && !success ? { scale: 1.02, boxShadow: '0 10px 28px rgba(164,131,116,0.35)' } : {}}
        whileTap={!loading && !success ? { scale: 0.98 } : {}}
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-primary-50
                    transition-all duration-200 ${
                      success
                        ? 'bg-primary-500'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-md'
                    }`}
      >
        {loading  ? <Loader2 className="w-4 h-4 animate-spin" /> :
         success  ? <><CheckCircle2 className="w-4 h-4" /> Connecté !</> :
                    <>Se connecter <ArrowRight className="w-4 h-4" /></>
        }
      </motion.button>

      {submitError && (
        <p className="text-xs text-red-500 font-semibold text-center">{submitError}</p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-primary-200" />
        <span className="text-xs text-primary-400 font-medium">Ou continuer avec</span>
        <div className="flex-1 h-px bg-primary-200" />
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        {['Google', 'Facebook'].map((provider) => (
          <motion.button
            key={provider}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary-200
                       text-xs font-semibold text-primary-700 hover:bg-primary-50 hover:border-primary-300
                       transition-all duration-150"
          >
            {provider === 'Google' ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            {provider}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-xs text-primary-500">
        Pas encore de compte ?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold text-primary-600 hover:underline"
        >
          S'inscrire gratuitement
        </button>
      </p>
    </form>
  )
}

// ── Register Form ─────────────────────────────────────────────
function RegisterForm({ onSwitch, onClose, onSuccess }) {
  const [role,     setRole]     = useState('TENANT')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [agreed,   setAgreed]   = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e = {}
    if (!name.trim())                          e.name     = 'Nom requis'
    if (!/\S+@\S+\.\S+/.test(email))           e.email    = 'Email invalide'
    if (password.length < 8)                   e.password = 'Min. 8 caractères'
    if (password !== confirm)                  e.confirm  = 'Les mots de passe ne correspondent pas'
    if (!agreed)                               e.agreed   = 'Veuillez accepter les conditions'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setErrors({})
    setSubmitError('')
    setLoading(true)
    try {
      const backendRole = role === 'PROPRIETAIRE' ? 'HOST' : 'GUEST'
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: backendRole,
        }),
      })

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Impossible de creer ce compte.')
        throw new Error(message)
      }

      const authResponse = await response.json()

      persistSession(authResponse)

      setSuccess(true)
      await new Promise((r) => setTimeout(r, 800))
      onSuccess?.(normalizeUser(authResponse.user, authResponse.role))
      onClose?.()
    } catch (error) {
      setSubmitError(error.message || 'Echec de la creation du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-primary-900">Créez votre compte 🏠</h2>
        <p className="text-sm text-primary-500 mt-1">Rejoignez des milliers d'utilisateurs sur Maskan</p>
      </div>

      <RoleSelector role={role} setRole={setRole} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nom complet" icon={User}
          placeholder="Mohamed Ben Ali" value={name}
          onChange={setName} error={errors.name}
        />
        <Field
          label="Téléphone" icon={Phone}
          placeholder="+216 XX XXX XXX" value={phone}
          onChange={setPhone}
        />
      </div>

      <Field
        label="Adresse email" icon={Mail}
        placeholder="vous@exemple.com" value={email}
        onChange={setEmail} error={errors.email}
      />
      <Field
        label="Mot de passe" icon={Lock} type={showPwd ? 'text' : 'password'}
        placeholder="Min. 8 caractères" value={password}
        onChange={setPassword} error={errors.password}
        toggle={() => setShowPwd((v) => !v)}
      />
      <Field
        label="Confirmer le mot de passe" icon={Lock} type={showPwd ? 'text' : 'password'}
        placeholder="Répétez le mot de passe" value={confirm}
        onChange={setConfirm} error={errors.confirm}
      />

      {/* Password strength */}
      {password.length > 0 && (
        <div className="flex gap-1.5 mt-0.5">
          {[0,1,2,3].map((i) => {
            const strength =
              password.length >= 12 ? 4 :
              password.length >= 8  ? 3 :
              password.length >= 6  ? 2 : 1
            return (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`flex-1 h-1 rounded-full ${
                  i < strength
                    ? strength <= 1 ? 'bg-red-400'
                    : strength <= 2 ? 'bg-amber-400'
                    : strength <= 3 ? 'bg-primary-400'
                    :                 'bg-primary-500'
                    : 'bg-primary-200'
                }`}
              />
            )
          })}
        </div>
      )}

      {/* Terms */}
      <label className="flex items-start gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded accent-primary-500 shrink-0"
        />
        <span className={`text-xs leading-relaxed ${errors.agreed ? 'text-red-500' : 'text-primary-500'}`}>
          J'accepte les{' '}
          <a href="#" className="text-primary-600 font-semibold hover:underline">
            conditions d'utilisation
          </a>{' '}
          et la{' '}
          <a href="#" className="text-primary-600 font-semibold hover:underline">
            politique de confidentialité
          </a>
        </span>
      </label>

      <motion.button
        type="submit"
        whileHover={!loading && !success ? { scale: 1.02, boxShadow: '0 10px 28px rgba(164,131,116,0.35)' } : {}}
        whileTap={!loading && !success ? { scale: 0.98 } : {}}
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-primary-50
                    transition-all duration-200 ${
                      success
                        ? 'bg-primary-500'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-md'
                    }`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
         success  ? <><CheckCircle2 className="w-4 h-4" /> Compte créé !</> :
                    <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
        }
      </motion.button>

      {submitError && (
        <p className="text-xs text-red-500 font-semibold text-center">{submitError}</p>
      )}

      <p className="text-center text-xs text-primary-500">
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold text-primary-600 hover:underline"
        >
          Se connecter
        </button>
      </p>
    </form>
  )
}

// ── Left Panel ────────────────────────────────────────────────
function LeftPanel({ quoteIdx }) {
  const q = QUOTES[quoteIdx % QUOTES.length]
  return (
    <div className="relative h-full min-h-[480px] overflow-hidden rounded-l-3xl hidden lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={q.image}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${q.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/30 to-primary-900/85" />
      <div className="absolute inset-0 bg-auth-gradient opacity-50" />

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-9 h-9 bg-primary-50/20 backdrop-blur rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-50" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-primary-50">Maskan</span>
      </div>

      {/* Trust pills */}
      <div className="absolute top-8 right-8 flex flex-col gap-2">
        {['SSL sécurisé', '18 000+ membres', 'Zéro frais cachés'].map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-semibold bg-primary-50/15 backdrop-blur-sm border border-primary-200/25
                       text-primary-50 px-3 py-1 rounded-full text-right"
          >
            ✓ {tag}
          </span>
        ))}
      </div>

      {/* Quote */}
      <div className="absolute bottom-10 left-8 right-8">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={q.text}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-primary-50 font-medium text-sm leading-relaxed mb-3 italic">{q.text}</p>
            <footer className="text-primary-50/60 text-xs font-semibold">— {q.author}</footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Main AuthModal ────────────────────────────────────────────
export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'

  const switchToLogin    = () => setMode('login')
  const switchToRegister = () => setMode('register')

  const formVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center:       ({ opacity: 1, x: 0,  transition: { duration: 0.4, ease: [0.22,1,0.36,1] } }),
    exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.28 } }),
  }

  const dir = mode === 'login' ? -1 : 1

  return (
    /* Backdrop */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4
                 bg-primary-900/50 backdrop-blur-sm"
    >
      {/* Modal shell */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit  ={{ opacity: 0, scale: 0.93,  y: 16 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-primary-100 rounded-3xl shadow-2xl overflow-hidden
                   grid grid-cols-1 lg:grid-cols-2 max-h-[95vh]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-primary-100
                     flex items-center justify-center text-primary-500 hover:bg-primary-200
                     transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left — Visual panel */}
        <LeftPanel quoteIdx={mode === 'login' ? 0 : 1} />

        {/* Right — Form panel */}
        <div className="relative overflow-hidden flex flex-col justify-center
                        px-8 py-10 sm:px-10 bg-primary-100 max-h-[95vh] overflow-y-auto">

          {/* Ambient orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl pointer-events-none opacity-50" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-primary-100 rounded-full blur-3xl pointer-events-none opacity-40" />

          {/* Form swap animation */}
          <AnimatePresence mode="wait" custom={dir}>
            {mode === 'login' ? (
              <motion.div
                key="login"
                custom={dir}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <LoginForm
                  onSwitch={switchToRegister}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                custom={dir}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <RegisterForm
                  onSwitch={switchToLogin}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
