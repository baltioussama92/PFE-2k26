import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import HomePage       from './pages/HomePage'
import SearchResults  from './pages/SearchResults'
import PropertyDetails from './pages/PropertyDetails'
import Login          from './pages/Login'
import Register       from './pages/Register'
import UserProfile    from './pages/UserProfile'
import AddProperty    from './pages/AddProperty'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -8 },
}
const pageTransition = { duration: 0.25, ease: 'easeInOut' } as const

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    transition={pageTransition}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes: React.FC = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageWrapper><HomePage        /></PageWrapper>} />
        <Route path="/search"    element={<PageWrapper><SearchResults   /></PageWrapper>} />
        <Route path="/property/:id" element={<PageWrapper><PropertyDetails /></PageWrapper>} />
        <Route path="/login"     element={<PageWrapper><Login           /></PageWrapper>} />
        <Route path="/register"  element={<PageWrapper><Register        /></PageWrapper>} />
        <Route path="/profile"   element={<PageWrapper><UserProfile     /></PageWrapper>} />
        <Route path="/add-property" element={<PageWrapper><AddProperty  /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App

