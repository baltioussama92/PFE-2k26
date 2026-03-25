import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/dashboard/DashboardLayout'

function normalizeDashboardRole(role) {
  if (role === 'HOST') return 'PROPRIETAIRE'
  if (role === 'PROPRIETOR') return 'PROPRIETAIRE'
  if (role === 'GUEST') return 'TENANT'
  if (role === 'ADMIN') return 'ADMIN'
  if (role === 'PROPRIETAIRE' || role === 'TENANT') return role
  return null
}

// -- Dashboard sub-routes --------------------------------------
function DashboardRoutes({ role }) {
  if (role === 'PROPRIETAIRE') return <Navigate to="/my-properties" replace />
  if (role === 'TENANT')       return <Navigate to="/bookings" replace />
  if (role === 'ADMIN')        return <Navigate to="/host-bookings" replace />
  return null
}

// --------------------------------------------------------------
// -- Main DashboardPage --------------------------------------
export default function DashboardPage() {
  const location = useLocation()
  const storedRole = normalizeDashboardRole(localStorage.getItem('userRole'))
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()
  const userRole = normalizeDashboardRole(storedUser?.role)
  const role = userRole || storedRole

  if (!role) return <Navigate to="/profile" replace />

  return (
    <DashboardLayout
      role={role}
      pathname={location.pathname}
      onRoleReset={() => {}}
    >
      <AnimatePresence mode="wait">
        <DashboardRoutes key={role} role={role} />
      </AnimatePresence>
    </DashboardLayout>
  )
}
