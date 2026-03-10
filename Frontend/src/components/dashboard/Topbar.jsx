import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, ChevronDown, LogOut, Settings, User, Sun, Moon } from 'lucide-react'

const ROLE_COLORS = {
  PROPRIETAIRE: { pill: 'bg-indigo-100 text-indigo-700',  ring: 'ring-indigo-200' },
  TENANT:       { pill: 'bg-emerald-100 text-emerald-700',ring: 'ring-emerald-200' },
  ADMIN:        { pill: 'bg-slate-200 text-slate-700',    ring: 'ring-slate-200'   },
}

const ROLE_LABELS = {
  PROPRIETAIRE: 'Propriétaire',
  TENANT:       'Locataire',
  ADMIN:        'Administrateur',
}

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Nouvelle réservation pour Appartement Lac II', time: 'Il y a 5 min',  unread: true  },
  { id: 2, text: 'Rim Khelil a laissé un avis 5★',              time: 'Il y a 1 h',    unread: true  },
  { id: 3, text: 'Votre annonce a été approuvée',               time: 'Il y a 3 h',    unread: false },
]

export default function Topbar({ role = 'TENANT', pageTitle = 'Tableau de bord', onMenuToggle }) {
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode,    setDarkMode]    = useState(false)

  const ac = ROLE_COLORS[role] || ROLE_COLORS.TENANT
  const unread = MOCK_NOTIFICATIONS.filter(n => n.unread).length

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center
                       justify-between px-4 sm:px-6 shrink-0 z-20 relative">

      {/* ── Left ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">{pageTitle}</h1>
          <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* ── Right ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.4 }}
          onClick={() => setDarkMode(v => !v)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" style={{width:'1.1rem',height:'1.1rem'}} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
              />
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1     }}
                exit  ={{ opacity: 0, y: 10, scale: 0.96   }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl
                           border border-slate-100 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">Notifications</p>
                  {unread > 0 && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      {unread} non lue{unread > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <ul>
                  {MOCK_NOTIFICATIONS.map(n => (
                    <li key={n.id}
                        className={`flex gap-3 px-4 py-3 border-b border-slate-50 last:border-none
                                    hover:bg-slate-50 cursor-pointer transition-colors
                                    ${n.unread ? 'bg-indigo-50/40' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs font-semibold text-indigo-600 hover:underline">
                    Voir toutes les notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl
                       hover:bg-slate-100 transition-colors duration-150"
          >
            <img
              src="https://i.pravatar.cc/36?img=1"
              alt="avatar"
              className={`w-8 h-8 rounded-xl object-cover ring-2 ${ac.ring}`}
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {role === 'PROPRIETAIRE' ? 'Karim T.' : role === 'ADMIN' ? 'Super Admin' : 'Rim K.'}
              </p>
              <span className={`text-[10px] font-semibold ${ac.pill} px-1.5 py-0.5 rounded-full`}>
                {ROLE_LABELS[role]}
              </span>
            </div>
            <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1     }}
                exit  ={{ opacity: 0, y: 10, scale: 0.96   }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl
                           border border-slate-100 overflow-hidden z-50 py-1"
              >
                {[
                  { icon: User,     label: 'Mon profil',   href: '/dashboard/settings' },
                  { icon: Settings, label: 'Paramètres',   href: '/dashboard/settings' },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href}
                     className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </a>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
