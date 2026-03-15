import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Compass, Bell, Heart, MessageSquare,
  ChevronDown, LogOut, Settings, User, Building2, Menu, X,
  Plus, CalendarCheck,
} from 'lucide-react'

// -- Nav Link definition --------------------------------------
const NAV_LINKS = [
  { to: '/',        label: 'Accueil',  icon: Home      },
  { to: '/explorer', label: 'Explorer', icon: Compass   },
]

// -- User dropdown items (tenant) -----------------------------
const TENANT_DROPDOWN = [
  { label: 'Mon Profil',       icon: User,          to: '/profile'   },
  { label: 'Mes Favoris',      icon: Heart,         to: '/favorites' },
  { label: 'Mes Réservations', icon: Building2,     to: '/bookings'  },
  { label: 'Messages',         icon: MessageSquare, to: '/messages'  },
  { label: 'Paramètres',       icon: Settings,      to: '/settings'  },
]

// -- Host dropdown items (proprietor) -------------------------
const HOST_DROPDOWN = [
  { label: 'Mon Profil',          icon: User,          to: '/profile'        },
  { label: 'Mes Propriétés',      icon: Building2,     to: '/my-properties'  },
  { label: 'Ajouter un bien',     icon: Plus,          to: '/add-property'   },
  { label: 'Réservations reçues', icon: CalendarCheck, to: '/host-bookings'  },
  { label: 'Messages',            icon: MessageSquare, to: '/messages'       },
  { label: 'Paramètres',          icon: Settings,      to: '/settings'       },
]

export default function Navbar({ user = null, onAuthClick, onLogout }) {
  const [scrolled,       setScrolled]       = useState(false)
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location    = useLocation()

  const isHost = user && (user.role === 'PROPRIETOR' || user.role === 'ADMIN')
  const DROPDOWN_ITEMS = isHost ? HOST_DROPDOWN : TENANT_DROPDOWN

  // -- Scroll listener --------------------------------------
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // -- Close dropdown on outside click ----------------------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // -- Close mobile menu on route change --------------------
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      {/* -- Main Navbar ---------------------------------------- */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-primary-50/80 backdrop-blur-xl shadow-glass border-b border-primary-200/40'
            : 'py-4 bg-primary-50/60 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* -- Logo ------------------------------------------- */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <motion.img
              whileHover={{ rotate: -6, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400 }}
              src="/maskan no name logo.png"
              alt="Maskan logo"
              className="h-10 w-auto shrink-0 drop-shadow-sm"
            />
            <span className="font-poppins font-bold text-xl tracking-tight">
              <span className="text-primary-600">Mas</span>
              <span className="text-primary-900">kan</span>
            </span>
          </Link>

          {/* -- Desktop Nav Links ------------------------------- */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                            transition-colors duration-150 ${
                  isActive(to)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-primary-700 hover:text-primary-500 hover:bg-primary-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {isActive(to) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-primary-100/60 -z-10"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* -- Right side ------------------------------------- */}
          <div className="flex items-center gap-2">

            {/* Notification bell (shown only if logged in) */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className="relative p-2 rounded-xl text-primary-500 hover:text-primary-600 hover:bg-primary-50
                           transition-colors duration-150"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-400 rounded-full ring-2 ring-primary-100" />
              </motion.button>
            )}

            {/* Become a host (shown only for tenants) / My Properties (shown for hosts) */}
            {user && (user.role === 'TENANT' || user.role === 'CLIENT' || user.role === 'USER') && (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
                           text-primary-600 hover:text-primary-700 hover:bg-primary-100 transition-colors duration-150"
              >
                <Building2 className="w-4 h-4" />
                Devenir Hôte
              </Link>
            )}
            {user && (user.role === 'PROPRIETOR' || user.role === 'ADMIN') && (
              <Link
                to="/my-properties"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
                           text-primary-600 hover:text-primary-700 hover:bg-primary-100 transition-colors duration-150"
              >
                <Building2 className="w-4 h-4" />
                Mes Propriétés
              </Link>
            )}

            {user ? (
              /* -- User Avatar + Dropdown ----------------------- */
              <div ref={dropdownRef} className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl
                             hover:bg-primary-50 transition-colors duration-150"
                >
                  <img
                    src={user.avatar || `https://i.pravatar.cc/40?img=1`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-primary-200"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-primary-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-primary-500 mt-0.5 capitalize">{user.role}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-primary-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -8 }}
                      animate={{ opacity: 1, scale: 1,    y: 0  }}
                      exit  ={{ opacity: 0, scale: 0.94, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-primary-200/50
                                 bg-primary-50/80 backdrop-blur-xl overflow-hidden shadow-glass-lg py-1"
                    >
                      {DROPDOWN_ITEMS.map(({ label, icon: Icon, to }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-700
                                     hover:bg-primary-50 hover:text-primary-600 transition-colors duration-100"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </Link>
                      ))}
                      <div className="my-1 border-t border-primary-200" />
                      <button
                        onClick={() => { setDropdownOpen(false); onLogout?.() }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 transition-colors duration-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* -- Auth Buttons ---------------------------------- */
              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAuthClick?.('login')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-primary-700
                             hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150"
                >
                  Connexion
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(164,131,116,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAuthClick?.('register')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-primary-50
                             bg-gradient-to-r from-primary-500 to-primary-600
                             shadow-md transition-all duration-150"
                >
                  S'inscrire
                </motion.button>
              </div>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-primary-700 hover:bg-primary-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* -- Mobile Drawer --------------------------------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-primary-900/30 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 border-l border-primary-200/10
                         bg-primary-900/90 backdrop-blur-2xl flex flex-col pt-20 pb-8 px-5 gap-2 md:hidden"
            >
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                              transition-colors duration-150 ${
                    isActive(to)
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-primary-100 hover:bg-primary-50/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {!user && (
                <div className="mt-auto flex flex-col gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onAuthClick?.('login') }}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-primary-300/40 px-4 py-3 text-sm font-semibold text-primary-100 transition hover:bg-primary-50/10"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onAuthClick?.('register') }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-primary-50 shadow-md shadow-primary-950/20 transition hover:bg-primary-600"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
