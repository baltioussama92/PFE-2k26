import React, { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import AdminView from './dashboard/AdminView'

const ROLE_STORAGE_KEY = 'userRole'
const USER_STORAGE_KEY = 'user'
const DASHBOARD_ROLE_KEY = 'maskan_role'

const normalizeDashboardRole = (role) => {
  const value = String(role || '').toUpperCase()
  if (value === 'ADMIN') return 'ADMIN'
  if (value === 'HOST' || value === 'PROPRIETOR' || value === 'PROPRIETAIRE' || value === 'OWNER') {
    return 'PROPRIETAIRE'
  }
  if (value === 'GUEST' || value === 'TENANT' || value === 'USER' || value === 'CLIENT') {
    return 'TENANT'
  }
  return null
}

const getRoleFromStorage = () => {
  const explicitDashboardRole = normalizeDashboardRole(localStorage.getItem(DASHBOARD_ROLE_KEY))
  if (explicitDashboardRole) return explicitDashboardRole

  const storedAuthRole = normalizeDashboardRole(localStorage.getItem(ROLE_STORAGE_KEY))
  if (storedAuthRole) return storedAuthRole

  try {
    const userRaw = localStorage.getItem(USER_STORAGE_KEY)
    if (!userRaw) return null
    const user = JSON.parse(userRaw)
    return normalizeDashboardRole(user?.role)
  } catch {
    return null
  }
}

// -- Role switcher shown when no role is set -------------------
const ROLES = [
  {
    id:    'PROPRIETAIRE',
    label: 'Propriétaire',
    desc:  'Gérez vos biens, suivez vos réservations et vos revenus.',
    color: 'from-primary-400 to-primary-600',
    ring:  'ring-primary-300',
    emoji: '\ud83c\udfe0',
  },
  {
    id:    'TENANT',
    label: 'Locataire',
    desc:  'Suivez vos séjours, vos favoris et votre historique de recherche.',
    color: 'from-primary-300 to-primary-500',
    ring:  'ring-primary-200',
    emoji: '\ud83d\udccd',
  },
  {
    id:    'ADMIN',
    label: 'Administrateur',
    desc:  'Supervisez les utilisateurs, validez les annonces et analysez la croissance.',
    color: 'from-primary-700 to-primary-900',
    ring:  'ring-primary-500',
    emoji: '\ud83d\udee1\ufe0f',
  },
]

function RolePicker({ onPick }) {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y:  0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <span className="text-3xl mb-3 block">\ud83c\udfe1</span>
          <h1 className="text-2xl font-extrabold text-primary-900">Tableau de bord Maskan</h1>
          <p className="text-primary-500 text-sm mt-2">Sélectionnez votre rôle pour continuer.</p>
        </div>
        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:   0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(r.id)}
              className={`w-full flex items-center gap-4 p-4 bg-primary-100 rounded-2xl border border-primary-200
                          hover:border-primary-300 shadow-sm transition-all text-left group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center
                               justify-center text-xl shrink-0 shadow-md`}>
                {r.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-primary-900 text-sm">{r.label}</p>
                <p className="text-xs text-primary-500 mt-0.5">{r.desc}</p>
              </div>
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-auto text-primary-200 group-hover:text-primary-500 transition-colors shrink-0"
              >
                {'->'}
              </motion.div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs text-primary-400 mt-6">
          En production, le rôle est déterminé automatiquement par votre compte.
        </p>
      </motion.div>
    </div>
  )
}

// -- Dashboard sub-routes --------------------------------------
function DashboardRoutes({ role }) {
  if (role === 'ADMIN')        return <AdminView />
  if (role === 'PROPRIETAIRE') return <Navigate to="/my-properties" replace />
  if (role === 'TENANT')       return <Navigate to="/bookings" replace />
  return null
}

// --------------------------------------------------------------
// -- Main DashboardPage --------------------------------------
export default function DashboardPage() {
  const location = useLocation()
  const [role, setRole] = useState(() => getRoleFromStorage())

  const handlePick = (r) => {
    localStorage.setItem(DASHBOARD_ROLE_KEY, r)
    setRole(r)
  }

  if (!role) return <RolePicker onPick={handlePick} />

  return (
    <DashboardLayout
      role={role}
      pathname={location.pathname}
      onRoleReset={() => { localStorage.removeItem(DASHBOARD_ROLE_KEY); setRole(getRoleFromStorage()) }}
    >
      <AnimatePresence mode="wait">
        <DashboardRoutes key={role} role={role} />
      </AnimatePresence>
    </DashboardLayout>
  )
}
