import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAdminAuth } from '../hooks/useAdminAuth'

interface ToastItem {
  id: number
  tone: 'success' | 'error'
  message: string
}

interface ToastContextValue {
  showToast: (message: string, tone?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const titleByPath: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/guest-verifications': 'Guest Verification',
  '/admin/users/details': 'User Details',
  '/admin/listings': 'Listings',
  '/admin/bookings': 'Bookings',
  '/admin/payments': 'Payments',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
  '/admin/host-demands': 'Host Demands',
}

const resolveTitle = (pathname: string): string => {
  if (/^\/admin\/users\/[^/]+$/.test(pathname)) return titleByPath['/admin/users/details']
  return titleByPath[pathname] || 'Admin'
}

export function useAdminToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useAdminToast must be used inside AdminLayout')
  }
  return context
}

function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-3 text-sm font-medium shadow-[0_10px_24px_rgba(58,45,40,0.18)] ${
            toast.tone === 'success'
              ? 'bg-[#3A2D28] text-[#FFFFFF]'
              : 'bg-[#CBAD8D] text-[#3A2D28]'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isChecking, isAdmin } = useAdminAuth()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toastApi = useMemo<ToastContextValue>(() => ({
    showToast: (message, tone = 'success') => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((prev) => [...prev, { id, tone, message }])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 2600)
    },
  }), [])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EBE3DB] text-[#3A2D28]">
        Checking admin access...
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/" replace />

  const goHome = () => navigate('/')
  const goExplore = () => navigate('/explorer')
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/', { replace: true })
  }

  return (
    <ToastContext.Provider value={toastApi}>
      <div className="relative flex min-h-screen overflow-hidden bg-[#F5EEE5]">
        <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#CBAD8D]/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-28 h-96 w-96 rounded-full bg-[#3A2D28]/12 blur-3xl" />

        <Sidebar onNavigateHome={goHome} onNavigateExplore={goExplore} onLogout={handleLogout} />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <Topbar
            title={resolveTitle(location.pathname)}
            onNavigateHome={goHome}
            onNavigateExplore={goExplore}
            onLogout={handleLogout}
          />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex-1 p-4 md:p-6"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  )
}
