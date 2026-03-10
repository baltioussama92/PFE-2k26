import React, { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProprietorView  from './dashboard/ProprietorView'
import TenantView      from './dashboard/TenantView'
import AdminView       from './dashboard/AdminView'

// ── Role switcher shown when no role is set ───────────────────
const ROLES = [
  {
    id:    'PROPRIETAIRE',
    label: 'Propriétaire',
    desc:  'Gérez vos biens, suivez vos réservations et vos revenus.',
    color: 'from-indigo-500 to-indigo-700',
    ring:  'ring-indigo-400',
    emoji: '🏠',
  },
  {
    id:    'TENANT',
    label: 'Locataire',
    desc:  'Suivez vos séjours, vos favoris et votre historique de recherche.',
    color: 'from-emerald-500 to-emerald-700',
    ring:  'ring-emerald-400',
    emoji: '🗝️',
  },
  {
    id:    'ADMIN',
    label: 'Administrateur',
    desc:  'Supervisez les utilisateurs, validez les annonces et analysez la croissance.',
    color: 'from-slate-600 to-slate-800',
    ring:  'ring-slate-400',
    emoji: '⚙️',
  },
]

function RolePicker({ onPick }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y:  0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <span className="text-3xl mb-3 block">🏡</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Tableau de bord Maskan</h1>
          <p className="text-slate-500 text-sm mt-2">Sélectionnez votre rôle pour continuer.</p>
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
              className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200
                          hover:border-slate-300 shadow-sm transition-all text-left group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center
                               justify-center text-xl shrink-0 shadow-md`}>
                {r.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm">{r.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
              </div>
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"
              >
                →
              </motion.div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          En production, le rôle est déterminé automatiquement par votre compte.
        </p>
      </motion.div>
    </div>
  )
}

// ── Dashboard sub-routes ──────────────────────────────────────
function DashboardRoutes({ role }) {
  if (role === 'PROPRIETAIRE') return <ProprietorView />
  if (role === 'TENANT')       return <TenantView     />
  if (role === 'ADMIN')        return <AdminView      />
  return null
}

// ══════════════════════════════════════════════════════════════
// ── Main DashboardPage ──────────────────────────────────────
export default function DashboardPage() {
  // In production this would come from auth context / JWT token.
  // For the prototype we store it in local state + localStorage.
  const [role, setRole] = useState(
    () => localStorage.getItem('maskan_role') || null
  )

  const location = useLocation()

  const handlePick = (r) => {
    localStorage.setItem('maskan_role', r)
    setRole(r)
  }

  if (!role) return <RolePicker onPick={handlePick} />

  return (
    <DashboardLayout
      role={role}
      pathname={location.pathname}
      onRoleReset={() => { localStorage.removeItem('maskan_role'); setRole(null) }}
    >
      <AnimatePresence mode="wait">
        <DashboardRoutes key={role} role={role} />
      </AnimatePresence>
    </DashboardLayout>
  )
}
