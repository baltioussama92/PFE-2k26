import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Building2, TrendingUp, ShieldCheck, CheckCircle2, XCircle,
  Ban, Settings, MoreHorizontal, ChevronLeft, ChevronRight, MapPin,
  Eye, Star, Loader2, AlertTriangle, SlidersHorizontal
} from 'lucide-react'
import {
  ADMIN_STATS, ADMIN_USERS, PENDING_PROPERTIES, GROWTH_CHART
} from '../../data/dashboardData'

// ── Icon map ─────────────────────────────────────────────────
const STAT_ICONS = { Users, Building2, TrendingUp, ShieldCheck }

// ── Role / Status helpers ─────────────────────────────────────
const ROLE_COLORS = {
  ADMIN:        'bg-red-100 text-red-600',
  PROPRIETAIRE: 'bg-indigo-100 text-indigo-600',
  TENANT:       'bg-emerald-100 text-emerald-600',
}
const STATUS_DOT = {
  active:   'bg-emerald-400',
  banned:   'bg-red-400',
  pending:  'bg-amber-400',
}

// ── Animated Stat Cards ───────────────────────────────────────
function StatCard({ stat, index }) {
  const Icon = STAT_ICONS[stat.icon] || TrendingUp
  const up   = stat.delta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y:  0  }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
                          ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {up ? '+' : ''}{stat.delta}%
        </span>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 leading-none">
        {typeof stat.value === 'number' ? stat.value.toLocaleString('fr-FR') : stat.value}
      </p>
      <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>

      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(stat.delta) * 3, 100)}%` }}
          transition={{ duration: 1, delay: 0.4 + index * 0.07 }}
          className="h-full rounded-full bg-slate-700"
        />
      </div>
    </motion.div>
  )
}

// ── SVG Line Chart ────────────────────────────────────────────
function LineChart({ data, labels, color = '#6366f1', label }) {
  const W = 480, H = 100, pad = 12
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - (v / max) * (H - pad * 2)
    return [x, y]
  })
  const dPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const aPath = dPath + ` L${pts[pts.length-1][0]},${H} L${pts[0][0]},${H} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={aPath} fill={`url(#g-${label})`} />
        <motion.path
          d={dPath} fill="none" stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {pts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="3" fill={color}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.06 }} />
        ))}
      </svg>
      {/* X labels */}
      <div className="flex justify-between px-3 mt-1">
        {labels.map(l => (
          <span key={l} className="text-[10px] text-slate-400">{l}</span>
        ))}
      </div>
    </div>
  )
}

// ── User Table Row ────────────────────────────────────────────
function UserRow({ user, index, onBan, onPromote }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleAction = async (fn) => {
    setMenuOpen(false)
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    fn()
    setLoading(false)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1,  x: 0   }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors"
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={user.avatar} alt={user.name}
                 className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
                              ${STATUS_DOT[user.status] || 'bg-slate-300'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600'}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">{user.joined}</td>
      <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{user.properties ?? '-'}</td>
      <td className="px-4 py-3.5">
        <div className="relative flex items-center gap-2">
          {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
          <button onClick={() => setMenuOpen(v => !v)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                             hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1,   y: 0  }}
                exit  ={{ opacity: 0, scale: 0.9,  y: 4  }}
                className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg
                           border border-slate-100 py-1 z-20"
              >
                {[
                  { icon: Eye,          label: 'Voir le profil',  action: () => {} },
                  { icon: Settings,     label: 'Modifier la'  +' '+'perm.',  action: () => onPromote(user.id) },
                  { icon: Ban,          label: 'Bannir',          action: () => onBan(user.id), danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button key={label}
                          onClick={() => handleAction(action)}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs
                                      hover:bg-slate-50 transition-colors
                                      ${danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />{label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  )
}

// ── Pending Property Card ─────────────────────────────────────
function PendingCard({ property, index, onApprove, onReject }) {
  const [decision, setDecision] = useState(null)
  const [loading,  setLoading]  = useState(false)

  const decide = async (type) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setDecision(type)
    setLoading(false)
    await new Promise(r => setTimeout(r, 600))
    if (type === 'approve') onApprove(property.id)
    else                    onReject(property.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y:  0  }}
      exit  ={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={property.image} alt={property.title}
             className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-white truncate">{property.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-300" />
              <span className="text-xs text-slate-300">{property.location}</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
            <p className="text-sm font-extrabold text-slate-900 whitespace-nowrap">
              {property.price.toLocaleString('fr-TN')} TND
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <img src={property.ownerAvatar} alt={property.owner}
               className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{property.owner}</p>
            <p className="text-[10px] text-slate-400">{property.submittedAt}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">{property.ownerRating}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {decision === 'approve' ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                            bg-emerald-100 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approuvé
            </div>
          ) : decision === 'reject' ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                            bg-red-100 text-red-600 text-xs font-bold">
              <XCircle className="w-3.5 h-3.5" /> Refusé
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => decide('approve')} disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600
                           transition-colors disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <><CheckCircle2 className="w-3.5 h-3.5" /> Approuver</>}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => decide('reject')} disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100
                           transition-colors disabled:opacity-60"
              >
                <XCircle className="w-3.5 h-3.5" /> Refuser
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Main AdminView ───────────────────────────────────────────
const PAGE_SIZE = 5

export default function AdminView() {
  const [users,    setUsers]    = useState(ADMIN_USERS)
  const [pending,  setPending]  = useState(PENDING_PROPERTIES)
  const [page,     setPage]     = useState(0)
  const [filter,   setFilter]   = useState('ALL')

  const roleFilter  = filter === 'ALL' ? users : users.filter(u => u.role === filter)
  const pageCount   = Math.ceil(roleFilter.length / PAGE_SIZE)
  const currentPage = roleFilter.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleBan     = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' } : u))
  const handlePromote = (id) => setUsers(prev => prev.map(u =>
    u.id === id ? { ...u, role: u.role === 'TENANT' ? 'PROPRIETAIRE' : u.role } : u
  ))
  const handleApprove = (id) => setPending(prev => prev.filter(p => p.id !== id))
  const handleReject  = (id) => setPending(prev => prev.filter(p => p.id !== id))

  const ROLE_FILTERS = ['ALL', 'TENANT', 'PROPRIETAIRE', 'ADMIN']

  return (
    <div className="space-y-8">

      {/* ── Stats Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_STATS.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
      </div>

      {/* ── Growth Chart ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-900 mb-1">Croissance de la plateforme</h2>
        <p className="text-xs text-slate-400 mb-5">Utilisateurs et annonces sur les 7 derniers mois</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Utilisateurs</p>
            <LineChart
              data={GROWTH_CHART.users}
              labels={GROWTH_CHART.labels}
              color="#6366f1"
              label="users"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Propriétés</p>
            <LineChart
              data={GROWTH_CHART.properties}
              labels={GROWTH_CHART.labels}
              color="#10b981"
              label="props"
            />
          </div>
        </div>
      </div>

      {/* ── User Management ──────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Gestion des utilisateurs</h2>
            <p className="text-xs text-slate-400 mt-0.5">{users.length} utilisateurs inscrits</p>
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1.5">
              {ROLE_FILTERS.map(r => (
                <motion.button
                  key={r} whileTap={{ scale: 0.93 }}
                  onClick={() => { setFilter(r); setPage(0) }}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                              ${filter === r ? 'text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {filter === r && (
                    <motion.span
                      layoutId="admin-filter"
                      className="absolute inset-0 bg-slate-700 rounded-full"
                    />
                  )}
                  <span className="relative">{r === 'ALL' ? 'Tous' : r}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Utilisateur', 'Rôle', 'Inscrit le', 'Propriétés', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentPage.map((u, i) => (
                  <UserRow key={u.id} user={u} index={i}
                           onBan={handleBan} onPromote={handlePromote} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, roleFilter.length)} / {roleFilter.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500
                                   hover:bg-slate-100 disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors
                                      ${i === page ? 'bg-slate-700 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))} disabled={page === pageCount - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500
                                   hover:bg-slate-100 disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Pending Properties ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">File d'approbation</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {pending.length} annonce{pending.length !== 1 ? 's' : ''} en attente de validation
            </p>
          </div>
          {pending.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> En attente
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed
                       border-slate-200 py-14 text-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-slate-600">File vide !</p>
            <p className="text-xs text-slate-400 mt-1">Toutes les annonces ont été traitées.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {pending.map((p, i) => (
                <PendingCard
                  key={p.id} property={p} index={i}
                  onApprove={handleApprove} onReject={handleReject}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
