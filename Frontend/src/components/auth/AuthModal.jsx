import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User, X } from 'lucide-react'
import { DEMO_CREDENTIALS, DEMO_MODE } from '../../data/demo'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'authToken'
const USER_STORAGE_KEY = 'user'
const ROLE_STORAGE_KEY = 'userRole'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PAGE_BG_IMAGE =
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=80'
const LOGIN_SIDE_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
const SIGNUP_SIDE_IMAGE =
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80'

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
  emailVerified: Boolean(user?.emailVerified),
  phoneVerified: Boolean(user?.phoneVerified),
  identityStatus: user?.identityStatus || 'not_verified',
  verificationLevel: user?.verificationLevel,
  rejectionReason: user?.rejectionReason,
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

const getApiErrorMessage = (payload, fallbackMessage) => {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (payload.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).find(
      (value) => typeof value === 'string' && value.trim(),
    )
    if (firstError) {
      return firstError
    }
  }

  return fallbackMessage
}

function TrustBadges() {
  const items = ['✓ SSL sécurisé', '✓ 18 000+ membres', '✓ Zéro frais cachés']

  return (
    <div className="flex flex-col items-end gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function SideBrandPanel({ image, quote, author, showWordmark = true }) {
  return (
    <section className="relative min-h-[620px] overflow-hidden">
      <img src={image} alt="Maison moderne" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/70" />

      <div className="absolute left-7 top-7 text-white">
        {showWordmark ? (
          <span className="text-xl font-semibold tracking-wide">Maskan</span>
        ) : (
          <span className="text-3xl font-bold tracking-widest">M</span>
        )}
      </div>

      <div className="absolute right-6 top-6">
        <TrustBadges />
      </div>

      <div className="absolute bottom-8 left-7 right-7 text-white">
        <p className="text-xl italic leading-relaxed">“{quote}”</p>
        <p className="mt-3 text-sm text-white/80">— {author}</p>
      </div>
    </section>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-[#A65B32]">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A65B32]" />
        {children}
      </div>
    </label>
  )
}

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register')
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [role, setRole] = useState('TENANT')

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [signupData, setSignupData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const passwordStrength = useMemo(() => {
    const length = signupData.password.length
    if (length >= 12) return 4
    if (length >= 9) return 3
    if (length >= 6) return 2
    if (length >= 1) return 1
    return 0
  }, [signupData.password])

  const switchMode = (nextIsLogin) => {
    setSubmitError('')
    setIsLogin(nextIsLogin)
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    const email = loginData.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(email)) {
      setSubmitError('Veuillez saisir une adresse email valide.')
      return
    }

    if (!loginData.password) {
      setSubmitError('Veuillez saisir votre mot de passe.')
      return
    }

    setIsLoading(true)

    try {
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
          email,
          password: loginData.password,
          rememberMe,
        }),
      })

      if (!response.ok) {
        let payload = null
        try {
          payload = await response.json()
        } catch {
          payload = null
        }
        throw new Error(getApiErrorMessage(payload, 'Identifiants invalides.'))
      }

      const payload = await response.json()
      persistSession(payload)
      onSuccess?.(normalizeUser(payload.user, payload.role))
      onClose?.()
    } catch (error) {
      setSubmitError(error?.message || 'Échec de connexion.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    const email = signupData.email.trim().toLowerCase()
    if (!signupData.fullName.trim()) {
      setSubmitError('Veuillez saisir votre nom complet.')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setSubmitError('Veuillez saisir une adresse email valide.')
      return
    }
    if (signupData.password.length < 8) {
      setSubmitError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas.')
      return
    }
    if (!acceptTerms) {
      setSubmitError('Vous devez accepter les conditions pour continuer.')
      return
    }

    setIsLoading(true)

    try {
      if (DEMO_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 250))
        switchMode(true)
        return
      }

      const apiRole = role === 'PROPRIETOR' ? 'HOST' : 'GUEST'

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupData.fullName.trim(),
          email,
          password: signupData.password,
          role: apiRole,
          phone: signupData.phone.trim() || undefined,
        }),
      })

      if (!response.ok) {
        let payload = null
        try {
          payload = await response.json()
        } catch {
          payload = null
        }
        throw new Error(getApiErrorMessage(payload, 'Inscription impossible.'))
      }

      const payload = await response.json()
      if (payload?.token && payload?.user) {
        persistSession(payload)
        onSuccess?.(normalizeUser(payload.user, payload.role))
        onClose?.()
        return
      }

      switchMode(true)
    } catch (error) {
      setSubmitError(error?.message || 'Échec de création du compte.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0">
        <img src={PAGE_BG_IMAGE} alt="Arrière-plan propriété de luxe" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-md" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.99 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2"
        >
          {isLogin ? (
            <>
              <SideBrandPanel
                image={LOGIN_SIDE_IMAGE}
                quote="Maskan ne vend pas des murs — il vend la promesse d'un chez-soi."
                author="Yasmine Belaid, Fondatrice"
                showWordmark
              />

              <section className="relative bg-[#FFF9F2] p-8 text-[#3E3026] md:p-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-5 top-5 rounded-full p-1 text-[#A65B32] transition hover:bg-[#A65B32]/10"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-4xl font-extrabold leading-tight">Bon retour ! 👋</h2>
                <p className="mt-2 text-[#A65B32]">Connectez-vous à votre compte Maskan</p>

                <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
                  <Field label="ADRESSE EMAIL" icon={Mail}>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="agence123@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      required
                    />
                  </Field>

                  <Field label="MOT DE PASSE" icon={Lock}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A65B32]"
                      aria-label="Afficher le mot de passe"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-[#5A4B3D]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 accent-[#A65B32]"
                      />
                      Se souvenir de moi
                    </label>
                    <button type="button" className="font-semibold text-[#A65B32] hover:underline">
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A65B32] px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-65"
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'} <ArrowRight className="h-4 w-4" />
                  </button>

                  {submitError && <p className="text-center text-sm font-medium text-red-600">{submitError}</p>}

                  <div className="flex items-center gap-3 text-sm text-[#9A8A7B]">
                    <span className="h-px flex-1 bg-[#E7D9CB]" />
                    Ou continuer avec
                    <span className="h-px flex-1 bg-[#E7D9CB]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="rounded-xl border border-[#DCCCBD] bg-white/50 px-4 py-2.5 font-medium text-[#5A4B3D] transition hover:bg-white"
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-[#DCCCBD] bg-white/50 px-4 py-2.5 font-medium text-[#5A4B3D] transition hover:bg-white"
                    >
                      Facebook
                    </button>
                  </div>

                  <p className="pt-2 text-center text-sm text-[#7A6B5D]">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode(false)}
                      className="font-bold text-[#A65B32] hover:underline"
                    >
                      S'inscrire gratuitement
                    </button>
                  </p>
                </form>
              </section>
            </>
          ) : (
            <>
              <section className="relative bg-[#FFF9F2] p-8 text-[#3E3026] md:p-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-5 top-5 rounded-full p-1 text-[#A65B32] transition hover:bg-[#A65B32]/10"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-4xl font-extrabold leading-tight">Créez votre compte 🏠</h2>
                <p className="mt-2 text-[#A65B32]">Rejoignez des milliers d'utilisateurs sur Maskan</p>

                <form className="mt-6 space-y-4" onSubmit={handleSignupSubmit}>
                  <div>
                    <p className="mb-2 text-xs font-bold tracking-[0.12em] text-[#A65B32]">JE SUIS UN(E)</p>
                    <div className="grid grid-cols-2 rounded-xl border border-[#E7D9CB] bg-white/50 p-1">
                      <button
                        type="button"
                        onClick={() => setRole('TENANT')}
                        className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                          role === 'TENANT' ? 'bg-[#A65B32] text-white' : 'text-[#6D5D4F] hover:bg-[#F7EEE5]'
                        }`}
                      >
                        <span className="font-semibold">Locataire</span>
                        <span className="block text-xs opacity-90">Je cherche un logement</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('PROPRIETOR')}
                        className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                          role === 'PROPRIETOR' ? 'bg-[#A65B32] text-white' : 'text-[#6D5D4F] hover:bg-[#F7EEE5]'
                        }`}
                      >
                        <span className="font-semibold">Propriétaire</span>
                        <span className="block text-xs opacity-90">Je gère des biens</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="NOM COMPLET" icon={User}>
                      <input
                        type="text"
                        value={signupData.fullName}
                        onChange={(event) => setSignupData((prev) => ({ ...prev, fullName: event.target.value }))}
                        placeholder="Mohamed Ben Ali"
                        autoComplete="name"
                        className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                        required
                      />
                    </Field>

                    <Field label="TÉLÉPHONE" icon={Phone}>
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(event) => setSignupData((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="+216 XX XXX XXX"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      />
                    </Field>
                  </div>

                  <Field label="ADRESSE EMAIL" icon={Mail}>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(event) => setSignupData((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="oussamaLOC123@gmail.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      required
                    />
                  </Field>

                  <Field label="MOT DE PASSE" icon={Lock}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(event) => setSignupData((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A65B32]"
                      aria-label="Afficher le mot de passe"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>

                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((barIndex) => (
                      <span
                        key={barIndex}
                        className={`h-1.5 rounded-full ${
                          passwordStrength > barIndex ? 'bg-[#A65B32]' : 'bg-[#E7D9CB]'
                        }`}
                      />
                    ))}
                  </div>

                  <Field label="CONFIRMER LE MOT DE PASSE" icon={Lock}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupData.confirmPassword}
                      onChange={(event) =>
                        setSignupData((prev) => ({ ...prev, confirmPassword: event.target.value }))
                      }
                      placeholder="Répétez le mot de passe"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#D7DDE7] bg-blue-50/50 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#A65B32] focus:ring-2 focus:ring-[#A65B32]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A65B32]"
                      aria-label="Afficher le mot de passe"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>

                  <label className="flex items-start gap-2 pt-1 text-sm text-[#6D5D4F]">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(event) => setAcceptTerms(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#A65B32]"
                      required
                    />
                    J'accepte les conditions d'utilisation et la politique de confidentialité
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A65B32] px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-65"
                  >
                    {isLoading ? 'Création...' : 'Créer mon compte'} <ArrowRight className="h-4 w-4" />
                  </button>

                  {submitError && <p className="text-center text-sm font-medium text-red-600">{submitError}</p>}

                  <p className="pt-1 text-center text-sm text-[#7A6B5D]">
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode(true)}
                      className="font-bold text-[#A65B32] hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                </form>
              </section>

              <SideBrandPanel
                image={SIGNUP_SIDE_IMAGE}
                quote="Chaque bonne propriété mérite un bon propriétaire — et chaque famille mérite un foyer digne."
                author="Karim Trabelsi, CTO"
                showWordmark={false}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}