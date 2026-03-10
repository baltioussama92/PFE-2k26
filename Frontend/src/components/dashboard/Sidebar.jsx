import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, CalendarCheck, MessageSquare,
  Heart, Search, Settings, LogOut, ChevronLeft, ChevronRight,
  Users, ShieldCheck, BarChart3, Flag, PlusCircle, Home,
  Bell, FileText, Star, Wallet, HelpCircle
} from 'lucide-react'

// ── Role-based nav config ─────────────────────────────────────
const NAV_CONFIG = {
  PROPRIETAIRE: {
    label: 'Propriétaire',
    accent: 'indigo',
    groups: [
      {
        title: 'Principal',
        items: [
          { to: '/dashboard',            icon: LayoutDashboard, label: 'Vue Générale'    },
          { to: '/dashboard/properties', icon: Building2,       label: 'Mes Propriétés' },
          { to: '/dashboard/bookings',   icon: CalendarCheck,   label: 'Réservations',  badge: '3' },
          { to: '/dashboard/revenue',    icon: Wallet,          label: 'Revenus'         },
        ],
      },
      {
        title: 'Communication',
        items: [
          { to: '/dashboard/messages', icon: MessageSquare, label: 'Messages',    badge: '12' },
          { to: '/dashboard/reviews',  icon: Star,          label: 'Avis'                     },
        ],
      },
      {
        title: 'Compte',
        items: [
          { to: '/dashboard/settings', icon: Settings,   label: 'Paramètres'  },
          { to: '/dashboard/help',     icon: HelpCircle, label: 'Aide'         },
        ],
      },
    ],
  },
  TENANT: {
    label: 'Locataire',
    accent: 'emerald',
    groups: [
      {
        title: 'Principal',
        items: [
          { to: '/dashboard',           icon: LayoutDashboard, label: 'Accueil'         },
          { to: '/dashboard/stays',     icon: CalendarCheck,   label: 'Mes Séjours',  badge: '2' },
          { to: '/dashboard/wishlist',  icon: Heart,           label: 'Favoris',      badge: '4' },
          { to: '/dashboard/searches',  icon: Search,          label: 'Historique'    },
        ],
      },
      {
        title: 'Communication',
        items: [
          { to: '/dashboard/messages', icon: MessageSquare, label: 'Messages', badge: '1' },
          { to: '/dashboard/reviews',  icon: Star,          label: 'Mes Avis'             },
        ],
      },
      {
        title: 'Compte',
        items: [
          { to: '/dashboard/settings', icon: Settings,   label: 'Paramètres' },
          { to: '/dashboard/help',     icon: HelpCircle, label: 'Aide'        },
        ],
      },
    ],
  },
  ADMIN: {
    label: 'Administrateur',
    accent: 'slate',
    groups: [
      {
        title: 'Contrôle',
        items: [
          { to: '/dashboard',            icon: BarChart3,       label: 'Vue Globale'    },
          { to: '/dashboard/users',      icon: Users,           label: 'Utilisateurs',  badge: '18k' },
          { to: '/dashboard/properties', icon: Building2,       label: 'Propriétés',    badge: '3'   },
          { to: '/dashboard/reports',    icon: Flag,            label: 'Signalements',  badge: '7', badgeAlert: true },
        ],
      },
      {
        title: 'Système',
        items: [
          { to: '/dashboard/logs',     icon: FileText,   label: 'Journaux'      },
          { to: '/dashboard/settings', icon: Settings,   label: 'Configuration' },
        ],
      },
    ],
  },
}

// ── Accent colour map ─────────────────────────────────────────
const ACCENT = {
  indigo:  { active: 'bg-indigo-600 text-white shadow-md',  hover: 'hover:bg-indigo-50 hover:text-indigo-700',  pill: 'bg-indigo-100 text-indigo-600', dot: 'bg-indigo-600', ring: 'ring-indigo-300' },
  emerald: { active: 'bg-emerald-600 text-white shadow-md', hover: 'hover:bg-emerald-50 hover:text-emerald-700',pill: 'bg-emerald-100 text-emerald-600',dot: 'bg-emerald-600',ring: 'ring-emerald-300' },
  slate:   { active: 'bg-slate-700 text-white shadow-md',   hover: 'hover:bg-slate-100 hover:text-slate-800',   pill: 'bg-slate-200 text-slate-600',    dot: 'bg-slate-600',   ring: 'ring-slate-300'   },
}

export default function Sidebar({ role = 'TENANT', collapsed, onToggle }) {
  const config = NAV_CONFIG[role] || NAV_CONFIG.TENANT
  const ac     = ACCENT[config.accent] || ACCENT.emerald
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      className="relative flex flex-col h-screen bg-white border-r border-slate-100
                 overflow-hidden shrink-0 z-30 shadow-sm"
    >
      {/* ── Logo ────────────────────────────────────────────── */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-100 shrink-0 overflow-hidden
                       ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                        bg-gradient-to-br ${
                          role === 'PROPRIETAIRE' ? 'from-indigo-500 to-indigo-700' :
                          role === 'ADMIN'        ? 'from-slate-600 to-slate-800' :
                                                   'from-emerald-500 to-emerald-700'
                        }`}>
          <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit  ={{ opacity: 0, width: 0       }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-bold text-lg tracking-tight">
                <span className={
                  role === 'PROPRIETAIRE' ? 'text-indigo-600' :
                  role === 'ADMIN'        ? 'text-slate-700'  :
                                            'text-emerald-600'
                }>Mas</span>
                <span className="text-slate-800">kan</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5 capitalize">
                {config.label}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav Groups ─────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
        {config.groups.map((group) => (
          <div key={group.title}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit  ={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label, badge, badgeAlert }) => {
                const isActive = location.pathname === to ||
                  (to !== '/dashboard' && location.pathname.startsWith(to))
                return (
                  <li key={to} className="relative">
                    <NavLink
                      to={to}
                      end={to === '/dashboard'}
                      title={collapsed ? label : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                  text-sm font-medium transition-all duration-150 overflow-hidden
                                  ${isActive ? ac.active : `text-slate-600 ${ac.hover}`}
                                  ${collapsed ? 'justify-center' : ''}`}
                    >
                      {/* Sliding active background */}
                      {isActive && (
                        <motion.div
                          layoutId={`sidebar-active-${role}`}
                          className="absolute inset-0 rounded-xl -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}

                      <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: '1.05rem', height: '1.05rem' }} />

                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0   }}
                            exit  ={{ opacity: 0, x: -8   }}
                            transition={{ duration: 0.18 }}
                            className="flex-1 whitespace-nowrap"
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {badge && !collapsed && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                          ${isActive
                                            ? 'bg-white/25 text-white'
                                            : badgeAlert
                                              ? 'bg-red-100 text-red-600'
                                              : ac.pill}`}>
                          {badge}
                        </span>
                      )}
                      {/* Collapsed badge dot */}
                      {badge && collapsed && (
                        <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                                          ${badgeAlert ? 'bg-red-500' : ac.dot}`} />
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User Footer ─────────────────────────────────────── */}
      <div className={`shrink-0 border-t border-slate-100 p-3 flex items-center gap-3
                       ${collapsed ? 'justify-center' : ''}`}>
        <img
          src="https://i.pravatar.cc/36?img=1"
          alt="avatar"
          className={`w-9 h-9 rounded-xl object-cover ring-2 shrink-0 ${ac.ring}`}
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit  ={{ opacity: 0, width: 0       }}
              className="flex-1 overflow-hidden"
            >
              <p className="text-xs font-bold text-slate-800 whitespace-nowrap truncate">
                {role === 'PROPRIETAIRE' ? 'Karim Trabelsi' :
                 role === 'ADMIN'        ? 'Super Admin'    : 'Rim Khelil'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{config.label}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && (
          <NavLink to="/" title="Déconnexion">
            <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
          </NavLink>
        )}
      </div>

      {/* ── Collapse Toggle ─────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200
                   flex items-center justify-center shadow-sm z-40 text-slate-500
                   hover:text-slate-800 transition-colors duration-150"
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft  className="w-3.5 h-3.5" />
        }
      </motion.button>
    </motion.aside>
  )
}
