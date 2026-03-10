import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

const PAGE_TITLES = {
  '/dashboard':            'Vue Générale',
  '/dashboard/properties': 'Mes Propriétés',
  '/dashboard/bookings':   'Réservations',
  '/dashboard/revenue':    'Revenus',
  '/dashboard/messages':   'Messages',
  '/dashboard/reviews':    'Avis',
  '/dashboard/stays':      'Mes Séjours',
  '/dashboard/wishlist':   'Favoris',
  '/dashboard/searches':   'Historique de recherche',
  '/dashboard/users':      'Gestion utilisateurs',
  '/dashboard/reports':    'Signalements',
  '/dashboard/settings':   'Paramètres',
  '/dashboard/logs':       'Journaux système',
  '/dashboard/help':       "Centre d'aide",
}

const pageVar = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.22 } },
}

export default function DashboardLayout({ role = 'TENANT', pathname = '/dashboard', children }) {
  const [collapsed,    setCollapsed]    = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  const pageTitle = PAGE_TITLES[pathname] || 'Tableau de bord'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <div className="hidden lg:block">
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
        />
      </div>

      {/* ── Mobile Sidebar Overlay ────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar
                role={role}
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Area ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          role={role}
          pageTitle={pageTitle}
          onMenuToggle={() => setMobileOpen(v => !v)}
        />

        {/* ── Scrollable Content ────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVar}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
