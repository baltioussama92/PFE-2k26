import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout         from './components/layout/Layout'
import HomePage       from './pages/HomePage'
import DashboardPage  from './pages/DashboardPage'
import AuthModal      from './components/auth/AuthModal'
import PropertyGrid   from './components/properties/PropertyGrid'

// ── Explorer Page ─────────────────────────────────────────────
function ExplorerPage() {
  return (
    <div className="pt-24">
      <PropertyGrid title="Explorer toutes les propriétés" />
    </div>
  )
}

// ── 404 Page ──────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-[10rem] font-extrabold text-primary-100 leading-none select-none">404</p>
      <h1 className="text-2xl font-extrabold text-slate-800 -mt-4">Page introuvable</h1>
      <p className="text-slate-500 text-sm mt-2 mb-8">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary">← Retour à l'accueil</Link>
    </div>
  )
}

// ── Routing split: /dashboard uses its own shell ─────────────
function AppRoutes() {
  const [authModal, setAuthModal] = useState(null)
  const [user,      setUser]      = useState(null)
  const location = useLocation()
  const isDash   = location.pathname.startsWith('/dashboard')

  return (
    <>
      {isDash ? (
        <Routes>
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
      ) : (
        <Layout user={user} onAuthClick={setAuthModal}>
          <Routes>
            <Route path="/"         element={<HomePage     />} />
            <Route path="/explorer" element={<ExplorerPage />} />
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
            onClose={() => setAuthModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
