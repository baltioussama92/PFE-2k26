import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Building2, CalendarCheck, MessageSquare, Wallet,
  Plus, Edit3, Trash2, BarChart2, Eye, Star, MapPin, X, Upload, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2, MoreVertical, ExternalLink, ArrowUpRight
} from 'lucide-react'
import {
  PROPRIETOR_STATS, PROPRIETOR_PROPERTIES, RECENT_BOOKINGS_PROP
} from '../../data/dashboardData'

// ── Icon resolver ─────────────────────────────────────────────
const ICONS = { TrendingUp, Building2, CalendarCheck, MessageSquare, Wallet }

// ── Colour map ────────────────────────────────────────────────
const CARD_COLORS = {
  indigo:  { bg: 'bg-indigo-50',  icon: 'bg-indigo-500',  text: 'text-indigo-600',  bar: 'bg-indigo-500'  },
  blue:    { bg: 'bg-blue-50',    icon: 'bg-blue-500',    text: 'text-blue-600',    bar: 'bg-blue-500'    },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-500',   text: 'text-amber-600',   bar: 'bg-amber-500'   },
}

const STATUS_COLORS = {
  active:   'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
  pending:  'bg-amber-100 text-amber-700',
}
const STATUS_LABELS = { active: 'Active', inactive: 'Inactive', pending: 'En attente' }
const BOOKING_STATUS = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending:   'bg-amber-100 text-amber-700',
}

// ══════════════════════════════════════════════════════════════
// ── Animated Counter ─────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const num       = parseFloat(String(value).replace(/[^0-9.]/g, ''))
  const formatted = isNaN(num) ? value : value
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (isNaN(num)) return
    let start  = 0
    const end  = num
    const dur  = 900
    const step = Math.ceil(end / (dur / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplayed(end); clearInterval(timer) }
      else               setDisplayed(start)
    }, 16)
    return () => clearInterval(timer)
  }, [num])

  if (isNaN(num)) return <span>{value}</span>
  return (
    <span>
      {prefix}
      {displayed >= 1000
        ? displayed.toLocaleString('fr-FR')
        : Math.round(displayed)}
      {suffix}
    </span>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Stats Card ───────────────────────────────────────────────
function StatCard({ stat, index }) {
  const Icon = ICONS[stat.icon] || TrendingUp
  const c    = CARD_COLORS[stat.color] || CARD_COLORS.indigo
  const up   = stat.delta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(99,102,241,0.10)' }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
                          ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(stat.delta)}{typeof stat.delta === 'number' && stat.delta % 1 !== 0 ? '%' : ''}
        </span>
      </div>

      <p className="text-2xl font-extrabold text-slate-900 leading-none mb-1">
        <AnimatedNumber value={stat.value} />
        {stat.unit && <span className="text-sm font-semibold text-slate-400 ml-1">{stat.unit}</span>}
      </p>
      <p className="text-xs text-slate-500 font-medium">{stat.label}</p>

      {/* Mini bar indicator */}
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(stat.delta) * 4, 100)}%` }}
          transition={{ duration: 1, delay: 0.4 + index * 0.08 }}
          className={`h-full rounded-full ${c.bar}`}
        />
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Property Management Card ─────────────────────────────────
function PropertyCard({ property, index, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm
                 hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img src={property.image} alt={property.title}
             className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full
                          ${STATUS_COLORS[property.status]}`}>
          {STATUS_LABELS[property.status]}
        </span>

        {/* More options */}
        <div className="absolute top-2 right-2 relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center
                       text-slate-600 hover:bg-white transition-colors shadow-sm"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit  ={{ opacity: 0, scale: 0.92, y: -4  }}
                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg
                           border border-slate-100 py-1 z-10"
              >
                {[
                  { icon: ExternalLink, label: "Voir l'annonce", color: '' },
                  { icon: Edit3,        label: 'Modifier',       color: '' },
                  { icon: BarChart2,    label: 'Analytiques',    color: '' },
                  { icon: Trash2,       label: 'Supprimer',      color: 'text-red-500 hover:bg-red-50' },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => { setMenuOpen(false); if (label === 'Supprimer') onDelete(property.id) }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs text-slate-700
                                hover:bg-slate-50 transition-colors ${color}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <p className="text-sm font-extrabold text-slate-900 leading-none">
            {property.price.toLocaleString('fr-TN')} TND
            <span className="text-[10px] font-normal text-slate-500">/mois</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm truncate">{property.title}</h3>
        <div className="flex items-center gap-1 mt-0.5 mb-3">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-500">{property.location}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Réservations', value: property.bookings   },
            { label: 'Vues',         value: property.views       },
            { label: 'Revenus',      value: `${(property.revenue/1000).toFixed(1)}k` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-slate-800">{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Rating */}
        {property.rating && (
          <div className="flex items-center gap-1.5 mt-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">{property.rating}</span>
            <span className="text-[10px] text-slate-400">note moyenne</span>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                             bg-indigo-50 text-indigo-700 text-xs font-semibold
                             hover:bg-indigo-100 transition-colors">
            <Edit3 className="w-3.5 h-3.5" /> Modifier
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                             bg-slate-100 text-slate-700 text-xs font-semibold
                             hover:bg-slate-200 transition-colors">
            <BarChart2 className="w-3.5 h-3.5" /> Analyse
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Multi-step Add Property Modal ────────────────────────────
const STEPS = ['Informations', 'Photos', 'Tarifs & Équipements']
const AMENITY_OPTIONS = [
  'WiFi', 'Climatisation', 'Parking', 'Piscine', 'Sécurité 24/7',
  'Cuisine équipée', 'Lave-linge', 'Terrasse', 'Jardin', 'Vue mer',
  'Ascenseur', 'Balcon', 'Cheminée', 'Salle de sport',
]

function AddPropertyModal({ onClose }) {
  const [step,       setStep]       = useState(0)
  const [direction,  setDirection]  = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: '', type: 'Appartement', location: '', city: '', bedrooms: 1, bathrooms: 1, area: '',
    description: '',
    photos: [],
    price: '', deposit: '', minStay: 1, currency: 'TND',
    amenities: [],
  })

  const next = () => { setDirection(1); setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  const prev = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)) }

  const toggleAmenity = (a) =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }))

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setDone(true)
    await new Promise(r => setTimeout(r, 1000))
    onClose()
  }

  const stepVar = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60  : -60  }),
    center:       ({ opacity: 1, x: 0, transition: { duration: 0.38, ease: [0.22,1,0.36,1] } }),
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 :  60, transition: { duration: 0.25 } }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4
                 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit  ={{ opacity: 0, scale: 0.92,  y: 16 }}
        transition={{ duration: 0.36, ease: [0.22,1,0.36,1] }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ajouter une propriété</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Étape {step + 1} sur {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center
                             text-slate-500 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2 px-6 pt-5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <motion.div
                  animate={{
                    backgroundColor: i < step ? '#6366f1' : i === step ? '#6366f1' : '#e2e8f0',
                    scale: i === step ? 1.1 : 1,
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </motion.div>
                <span className={`text-[10px] font-semibold hidden sm:block ${i === step ? 'text-indigo-600' : i < step ? 'text-slate-500' : 'text-slate-300'}`}>
                  {s}
                </span>
              </div>
              <motion.div
                animate={{ backgroundColor: i <= step ? '#6366f1' : '#e2e8f0' }}
                transition={{ duration: 0.4 }}
                className="h-1 rounded-full"
              />
            </div>
          ))}
        </div>

        {/* Form area */}
        <div className="overflow-hidden px-6 py-5" style={{ minHeight: 340 }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div key="step0" custom={direction} variants={stepVar}
                          initial="enter" animate="center" exit="exit"
                          className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Titre de l'annonce *
                    </label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                           placeholder="ex : Appartement vue mer à La Marsa"
                           className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Type
                    </label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                            className="input-field">
                      {['Appartement','Villa','Studio','Penthouse','Chalet','Maison'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Ville
                    </label>
                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                           placeholder="Tunis, Hammamet…" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Chambres
                    </label>
                    <input type="number" min="1" max="20" value={form.bedrooms}
                           onChange={e => setForm(f => ({ ...f, bedrooms: +e.target.value }))}
                           className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Surface (m²)
                    </label>
                    <input type="number" value={form.area}
                           onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                           placeholder="120" className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea rows={3} value={form.description}
                              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                              placeholder="Décrivez votre bien en quelques phrases…"
                              className="input-field resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={stepVar}
                          initial="enter" animate="center" exit="exit"
                          className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8
                                text-center hover:border-indigo-300 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-semibold text-slate-600">Glissez vos photos ici</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP — max 10 Mo par fichier</p>
                  <button className="mt-4 px-5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold
                                     hover:bg-indigo-100 transition-colors">
                    Parcourir les fichiers
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  La <span className="font-semibold text-slate-600">première photo</span> sera l'image principale.
                  Ajoutez au moins 3 photos pour maximiser vos chances.
                </p>
                {/* Placeholder preview grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={stepVar}
                          initial="enter" animate="center" exit="exit"
                          className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Loyer mensuel (TND) *
                    </label>
                    <input type="number" value={form.price}
                           onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                           placeholder="1800" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Dépôt de garantie
                    </label>
                    <input type="number" value={form.deposit}
                           onChange={e => setForm(f => ({ ...f, deposit: e.target.value }))}
                           placeholder="3600" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Séjour min. (jours)
                    </label>
                    <input type="number" min="1" value={form.minStay}
                           onChange={e => setForm(f => ({ ...f, minStay: +e.target.value }))}
                           className="input-field" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Équipements
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map(a => {
                      const sel = form.amenities.includes(a)
                      return (
                        <motion.button
                          key={a} type="button"
                          whileTap={{ scale: 0.93 }}
                          onClick={() => toggleAmenity(a)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                                      ${sel
                                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                          {sel && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {a}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button onClick={prev} disabled={step === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                             text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          {step < STEPS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={next}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold
                         text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={!submitting && !done ? { scale: 1.03 } : {}}
              whileTap={!submitting && !done  ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white
                          shadow-sm transition-all duration-200
                          ${done ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" />  :
               done       ? <><CheckCircle2 className="w-4 h-4" /> Publié !</> :
                            'Publier l\'annonce'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Main ProprietorView ──────────────────────────────────────
export default function ProprietorView() {
  const [showModal,   setShowModal]   = useState(false)
  const [properties,  setProperties]  = useState(PROPRIETOR_PROPERTIES)

  const handleDelete = (id) =>
    setProperties(prev => prev.filter(p => p.id !== id))

  return (
    <div className="space-y-8">

      {/* ── Stats Header ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PROPRIETOR_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* ── Properties Grid + Add CTA ───────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Mes Propriétés</h2>
            <p className="text-xs text-slate-400 mt-0.5">{properties.length} annonces au total</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(99,102,241,0.30)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white
                       text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} onDelete={handleDelete} />
          ))}
          {/* Add New Card Placeholder */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: properties.length * 0.07 }}
            whileHover={{ scale: 1.02, borderColor: '#6366f1' }}
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl
                       border-2 border-dashed border-slate-200 min-h-[240px]
                       text-slate-400 hover:text-indigo-600 transition-all duration-200"
          >
            <Plus className="w-10 h-10" strokeWidth={1.5} />
            <span className="text-sm font-semibold">Nouvelle propriété</span>
          </motion.button>
        </div>
      </div>

      {/* ── Recent Bookings table ─────────────────────────── */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">Réservations récentes</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Locataire', 'Propriété', 'Dates', 'Montant', 'Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS_PROP.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={b.avatar} alt={b.tenant}
                           className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
                      <span className="font-medium text-slate-800 text-xs">{b.tenant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">{b.property}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.dates}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">
                    {b.amount.toLocaleString('fr-TN')} TND
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full
                                      ${BOOKING_STATUS[b.status]}`}>
                      {b.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Property Modal ────────────────────────────── */}
      <AnimatePresence>
        {showModal && <AddPropertyModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
