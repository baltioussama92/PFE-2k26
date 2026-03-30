/**
 * Navbar.tsx
 * ------------------------------------------------------------------------------
 * Glassmorphism navigation bar that becomes frosted on scroll.
 *
 * Features:
 *   � Transparent ? blurred glass transition on scroll
 *   � Animated mobile drawer (Framer Motion)
 *   � Notification bell with unread badge
 *   � User profile dropdown with role-aware links
 *   � Connect `isLoggedIn` / `user` / `unreadCount` to your AuthContext later
 * ------------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Home,
  Search,
  Bell,
  MessageSquare,
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
import { AUTH_TOKEN_KEY } from '../../api/apiClient'
import { authService } from '../../services/authService'

// --- Types --------------------------------------------------------------------
interface NavUser {
  name?: string
  fullName?: string
  email: string
  role: 'PROPRIETOR' | 'TENANT' | 'ADMIN' | 'OWNER'
  avatarUrl?: string
}

const MOCK_UNREAD = 3

const getStoredUser = (): NavUser | null => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.email || !parsed?.role) return null

    return parsed as NavUser
  } catch {
    return null
  }
}

const hasAuthToken = (): boolean => Boolean(localStorage.getItem(AUTH_TOKEN_KEY))

// --- Nav links ----------------------------------------------------------------
const NAV_LINKS = [
  { label: 'Home',    to: '/',       icon: <Home      size={16} /> },
  { label: 'Explore', to: '/search', icon: <Search    size={16} /> },
  { label: 'About',   to: '/#about-house', icon: <Building2 size={16} /> },
]

// --- Motion variants ----------------------------------------------------------
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

// --- Component ----------------------------------------------------------------
const Navbar: React.FC = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState<NavUser | null>(() => getStoredUser())
  const displayName = user ? (user.fullName || user.name || 'User') : 'User'
  const unreadCount = MOCK_UNREAD
  const isLoggedIn = !!user && hasAuthToken()

  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const useSolidNavbar = scrolled || pathname !== '/'

  // -- Detect scroll to toggle glass effect ------------------------------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // -- Close dropdown on outside click -----------------------------------------
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // -- Close mobile menu on route change ---------------------------------------
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Keep navbar auth state synced with localStorage updates.
  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser())
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('focus', syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('focus', syncUser)
    }
  }, [])

  // Fetch fresh user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasAuthToken()) {
        try {
          const freshUser = await authService.getCurrentUser()
          setUser({
            name: freshUser.fullName,
            fullName: freshUser.fullName,
            email: freshUser.email,
            role: freshUser.role,
          })
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // If token is invalid, logout
          authService.logout()
          setUser(null)
        }
      }
    }
    fetchUserData()
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* -- Main bar -------------------------------------------------------- */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          useSolidNavbar
            ? 'bg-primary-50/80 backdrop-blur-lg shadow-glass border-b border-primary-200/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* -- Logo ---------------------------------------------------- */}
            <Link
              to="/"
              className="flex items-center gap-2 select-none group"
            >
              <img
                src="/maskan no name logo.png"
                alt="Maskan Logo"
                className="h-20 w-auto group-hover:scale-105 transition-transform"
              />
              <span
                className={[
                  'text-xl font-bold tracking-tight transition-colors',
                  useSolidNavbar ? 'text-primary-900' : 'text-primary-50 drop-shadow',
                ].join(' ')}
              >
                Maskan
              </span>
            </Link>

            {/* -- Desktop nav links --------------------------------------- */}
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
                        ? 'bg-primary-500/10 text-primary-600'
                        : useSolidNavbar
                          ? 'text-primary-600 hover:text-primary-600 hover:bg-primary-50'
                          : 'text-primary-50/90 hover:text-primary-50 hover:bg-primary-50/10',
                    ].join(' ')}
                  >
                    {icon}
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* -- Right-side actions -------------------------------------- */}
            <div className="flex items-center gap-2">

              {/* Notification bell � only when logged in */}
              {isLoggedIn && (
                <>
                  <Link
                    to="/messages"
                    className={[
                      'relative p-2 rounded-xl transition-colors',
                      pathname === '/messages'
                        ? 'bg-primary-500/10 text-primary-600'
                        : useSolidNavbar
                          ? 'text-primary-600 hover:bg-primary-50'
                          : 'text-primary-50/90 hover:bg-primary-50/10',
                    ].join(' ')}
                    aria-label="Open messages"
                  >
                    <MessageSquare size={20} />
                  </Link>

                  <button
                    className={[
                      'relative p-2 rounded-xl transition-colors',
                      useSolidNavbar
                        ? 'text-primary-600 hover:bg-primary-50'
                        : 'text-primary-50/90 hover:bg-primary-50/10',
                    ].join(' ')}
                    aria-label={`${unreadCount} notifications`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-accent-500 text-primary-50 text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-primary-100">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* -- Auth section ------------------------------------------ */}
              {isLoggedIn && user ? (
                /* User profile dropdown */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className={[
                      'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200',
                      useSolidNavbar
                        ? 'border-primary-200 bg-primary-100 hover:bg-primary-50 text-primary-700'
                        : 'border-primary-200/20 bg-primary-50/10 hover:bg-primary-50/20 text-primary-50',
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
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-primary-50 text-xs font-bold">
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
                        className="absolute right-0 mt-2 w-56 bg-primary-100 rounded-2xl shadow-card-hover border border-primary-200 py-2 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-primary-200">
                          <p className="text-sm font-semibold text-primary-900">{displayName}</p>
                          <p className="text-xs text-primary-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary-50 text-primary-600">
                            {user.role}
                          </span>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <DropdownItem to="/profile"      icon={<UserCircle size={15}  />} label="My Profile" />
                          <DropdownItem to="/messages"     icon={<MessageSquare size={15} />} label="Messages" />
                          {user.role === 'PROPRIETOR' && (
                            <DropdownItem to="/add-property" icon={<PlusSquare  size={15}  />} label="Add Property" />
                          )}
                          {user.role === 'ADMIN' && (
                            <DropdownItem to="/admin"        icon={<ShieldCheck size={15}  />} label="Admin Panel" />
                          )}
                          <DropdownItem to="/settings"    icon={<Settings   size={15}  />} label="Settings" />
                        </div>

                        {/* Logout */}
                        <div className="py-1 border-t border-primary-200">
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
                      useSolidNavbar
                        ? 'text-primary-700 hover:bg-primary-50'
                        : 'text-primary-50/90 hover:bg-primary-50/10',
                    ].join(' ')}
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-primary-50 rounded-xl text-sm font-semibold shadow-md shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 active:scale-95"
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
                  useSolidNavbar ? 'text-primary-700 hover:bg-primary-50' : 'text-primary-50 hover:bg-primary-50/10',
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

      {/* -- Mobile drawer --------------------------------------------------- */}
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
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-primary-100 shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-primary-200">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <Building2 size={14} className="text-primary-50" />
                  </div>
                  <span className="font-bold text-primary-900">Maskan</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-500"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}

                {isLoggedIn && (
                  <Link
                    to="/messages"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                  >
                    <MessageSquare size={16} />
                    Messages
                  </Link>
                )}
              </nav>

              {/* Auth buttons */}
              {!isLoggedIn && (
                <div className="p-4 space-y-2 border-t border-primary-200">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-500 text-primary-50 font-semibold hover:bg-primary-600 transition-colors"
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

// --- Helper: single dropdown menu item ----------------------------------------
const DropdownItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
  >
    {icon}
    {label}
  </Link>
)

export default Navbar

