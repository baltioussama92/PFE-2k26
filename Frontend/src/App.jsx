import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout         from './layout/Layout'
import HomePage       from './pages/HomePage'
import DashboardPage  from './pages/DashboardPage'
import AuthModal      from './components/auth/AuthModal'
import PropertyGrid   from './components/properties/PropertyGrid'
import PropertyDetails from './pages/PropertyDetails'
import ProfilePage    from './pages/ProfilePage'
import HostVerificationPage from './pages/HostVerificationPage'
import GuestVerificationPage from './pages/GuestVerificationPage'
import WishlistPage       from './pages/WishlistPage'
import BookingsPage       from './pages/BookingsPage'
import MessagesPage       from './pages/MessagesPage'
import SettingsPage       from './pages/SettingsPage'
import AddPropertyPage    from './pages/AddPropertyPage'
import MyPropertiesPage   from './pages/MyPropertiesPage'
import HostBookingsPage   from './pages/HostBookingsPage'
import AdminControlPage   from './pages/AdminControlPage'
import AdminLayout from './admin/components/AdminLayout'
import AdminDashboardPage from './admin/pages/Dashboard'
import AdminUsersPage from './admin/pages/Users'
import AdminUserDetailsPage from './admin/pages/UserDetails'
import AdminListingsPage from './admin/pages/Listings'
import AdminBookingsPage from './admin/pages/Bookings'
import AdminPaymentsPage from './admin/pages/Payments'
import AdminReportsPage from './admin/pages/Reports'
import AdminSettingsPage from './admin/pages/Settings'
import AdminHostDemandsPage from './admin/pages/HostDemands'
import { DEMO_MODE } from './data/demo'

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

const normalizeUser = (user) => ({
  id: user?.id,
  name: user?.fullName || user?.name || 'User',
  email: user?.email,
  role: mapRole(user?.role),
  username: user?.username || '',
  bio: user?.bio || '',
  avatar: user?.avatar || '',
  emailVerified: Boolean(user?.emailVerified),
  phoneVerified: Boolean(user?.phoneVerified),
  identityStatus: user?.identityStatus || 'not_verified',
  verificationLevel: user?.verificationLevel,
  rejectionReason: user?.rejectionReason,
})

// -- Explorer Page with Search -----------------------------------------------
function ExplorerPage({ user = null, onAuthClick = null }) {
  const [searchParams] = useSearchParams()
  const location = searchParams.get('location')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests')

  return (
    <div className="pt-24">
      <PropertyGrid 
        title={location ? `Propriétés à ${location}` : 'Explorer toutes les propriétés'}
        searchFilters={{ location, checkIn, checkOut, guests: guests ? parseInt(guests) : null }}
        user={user}
        onAuthClick={onAuthClick}
      />
    </div>
  )
}

// -- 404 Page --------------------------------------------------
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-[10rem] font-extrabold text-primary-100 leading-none select-none">404</p>
      <h1 className="text-2xl font-extrabold text-primary-800 -mt-4">Page introuvable</h1>
      <p className="text-primary-500 text-sm mt-2 mb-8">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-primary-50 shadow-md shadow-primary-500/25 transition hover:bg-primary-600 hover:shadow-primary-500/35"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}

// -- Routing split: /dashboard uses its own shell -------------
function AppRoutes() {
  const [authModal, setAuthModal] = useState(null)
  const [user,      setUser]      = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isDash   = location.pathname.startsWith('/dashboard')
  const isAdminArea = location.pathname.startsWith('/admin')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('auth') === 'login') {
      setAuthModal('login')
    }
  }, [location.search])

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!token) {
        setUser(null)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Session invalide')
        }

        const backendUser = await response.json()
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(backendUser))
        if (backendUser?.role) {
          localStorage.setItem(ROLE_STORAGE_KEY, mapRole(backendUser.role))
        }

        setUser(normalizeUser(backendUser))
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(USER_STORAGE_KEY)
        localStorage.removeItem(ROLE_STORAGE_KEY)
        setUser(null)
      }
    }

    verifySession()
  }, [])

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser)
    setAuthModal(null)
    navigate('/explorer', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(ROLE_STORAGE_KEY)
    setUser(null)
    navigate('/', { replace: true })
  }

  return (
    <>
      {isDash ? (
        <Routes>
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
      ) : isAdminArea ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:userId" element={<AdminUserDetailsPage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="host-demands" element={<AdminHostDemandsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      ) : (
        <Layout user={user} onAuthClick={setAuthModal} onLogout={handleLogout}>
          <Routes>
            <Route path="/"         element={<HomePage user={user} onAuthClick={setAuthModal} />} />
            <Route path="/explorer" element={<ExplorerPage user={user} onAuthClick={setAuthModal} />} />
            <Route path="/property/:id" element={<PropertyDetails user={user} onAuthClick={setAuthModal} />} />
            <Route path="/profile"  element={<ProfilePage user={user} onUserUpdate={setUser} />} />
            <Route path="/host-verification" element={<HostVerificationPage user={user} onUserUpdate={setUser} />} />
            <Route path="/guest-verification" element={<GuestVerificationPage user={user} onUserUpdate={setUser} />} />
            <Route path="/favorites" element={<WishlistPage user={user} />} />
            <Route path="/bookings"  element={<BookingsPage user={user} />} />
            <Route path="/messages"  element={<MessagesPage user={user} />} />
            <Route path="/settings"  element={<SettingsPage user={user} onUserUpdate={setUser} onLogout={handleLogout} />} />
            <Route path="/add-property"    element={<AddPropertyPage user={user} />} />
            <Route path="/my-properties"   element={<MyPropertiesPage user={user} />} />
            <Route path="/host-bookings"   element={<HostBookingsPage user={user} />} />
            <Route path="/admin-control"   element={<AdminControlPage user={user} />} />
            <Route path="*"         element={<NotFound     />} />
          </Routes>
        </Layout>
      )}

      {/* Global Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <AuthModal
            key="global-auth"
            initialMode={authModal}
            onSuccess={handleAuthSuccess}
            onClose={() => setAuthModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// -- Root App --------------------------------------------------
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  )
}
