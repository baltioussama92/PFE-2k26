/**
 * Navbar.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Glassmorphism navigation bar that becomes frosted on scroll.
 *
 * Features:
 *  • Transparent → blurred glass transition on scroll
 *  • Animated mobile drawer (Framer Motion)
 *  • Notification bell with unread badge
 *  • User profile dropdown with role-aware links
 *  • Connect `isLoggedIn` / `user` / `unreadCount` to your AuthContext later
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Home,
  Search,
  Bell,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  UserCircle,
  Settings,
  PlusSquare,
  ShieldCheck,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavUser {
  name?: string
  fullName?: string
  email: string
  role: 'PROPRIETOR' | 'TENANT' | 'ADMIN' | 'OWNER'
  avatarUrl?: string
}

// ─── Mock auth state — replace with your AuthContext / token check ─────────────
const MOCK_USER: NavUser | null = null        // set to a NavUser object to test logged-in UI
const MOCK_UNREAD  = 3                        // unread notification count

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',    to: '/',       icon: <Home      size={16} /> },
  { label: 'Explore', to: '/search', icon: <Search    size={16} /> },
  { label: 'About',   to: '/#about-house', icon: <Building2 size={16} /> },
]

// ─── Motion variants ──────────────────────────────────────────────────────────
const drawerVariants: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0,      opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.2 } },
}

const dropdownVariants: Variants = {
  hidden:  { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.15 } },
  exit:    { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.1 } },
}

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar: React.FC = () => {
  // TODO: replace with real auth state from your AuthContext
  // Using useState so TS doesn't narrow the type to literal `null`
  const [user] = useState<NavUser | null>(MOCK_USER)
  const displayName = user ? (user.fullName || user.name || 'User') : 'User'
  const unreadCount  = MOCK_UNREAD
  const isLoggedIn   = !!user

  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // ── Detect scroll to toggle glass effect ────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close dropdown on outside click ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Close mobile menu on route change ───────────────────────────────────────
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // ── Mock logout handler — wire to your AuthService ──────────────────────────
  const handleLogout = () => {
    // TODO: authService.logout()  →  navigate('/login')
    setDropdownOpen(false)
  }

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────────────────── */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-glass border-b border-white/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <Link
              to="/"
              className="flex items-center gap-2 select-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Building2 size={16} className="text-white" />
              </div>
              <span
                className={[
                  'text-xl font-bold tracking-tight transition-colors',
                  scrolled ? 'text-slate-900' : 'text-white drop-shadow',
                ].join(' ')}
              >
                Maskan
              </span>
            </Link>

            {/* ── Desktop nav links ─────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, to, icon }) => {
                const active = pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={[
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-brand-500/10 text-brand-600'
                        : scrolled
                          ? 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10',
                    ].join(' ')}
                  >
                    {icon}
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* ── Right-side actions ────────────────────────────────────── */}
            <div className="flex items-center gap-2">

              {/* Notification bell — only when logged in */}
              {isLoggedIn && (
                <button
                  className={[
                    'relative p-2 rounded-xl transition-colors',
                    scrolled
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-white/90 hover:bg-white/10',
                  ].join(' ')}
                  aria-label={`${unreadCount} notifications`}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* ── Auth section ────────────────────────────────────────── */}
              {isLoggedIn && user ? (
                /* User profile dropdown */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className={[
                      'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200',
                      scrolled
                        ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 text-white',
                    ].join(' ')}
                  >
                    {/* Avatar or initials */}
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block">
                      {displayName.split(' ')[0]}
                    </span>
                    <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-slate-100 py-2 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-brand-50 text-brand-600">
                            {user.role}
                          </span>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <DropdownItem to="/profile"      icon={<UserCircle size={15}  />} label="My Profile" />
                          {user.role === 'PROPRIETOR' && (
                            <DropdownItem to="/add-property" icon={<PlusSquare  size={15}  />} label="Add Property" />
                          )}
                          {user.role === 'ADMIN' && (
                            <DropdownItem to="/admin"        icon={<ShieldCheck size={15}  />} label="Admin Panel" />
                          )}
                          <DropdownItem to="/settings"    icon={<Settings   size={15}  />} label="Settings" />
                        </div>

                        {/* Logout */}
                        <div className="py-1 border-t border-slate-100">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Guest auth buttons */
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={[
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      scrolled
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-white/90 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-200 active:scale-95"
                  >
                    <User size={15} />
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className={[
                  'md:hidden p-2 rounded-xl transition-colors',
                  scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10',
                ].join(' ')}
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Building2 size={14} className="text-white" />
                  </div>
                  <span className="font-bold text-slate-900">Maskan</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV_LINKS.map(({ label, to, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Auth buttons */}
              {!isLoggedIn && (
                <div className="p-4 space-y-2 border-t border-slate-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                  >
                    <User size={16} />
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Helper: single dropdown menu item ────────────────────────────────────────
const DropdownItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
  >
    {icon}
    {label}
  </Link>
)

export default Navbar

