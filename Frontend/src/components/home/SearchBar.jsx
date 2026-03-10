import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, Search, ChevronDown, Plus, Minus } from 'lucide-react'
import { CITIES } from '../../data/mockData'

// ── Date formatter helper ────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : null

// ── Pill Divider ─────────────────────────────────────────────
function Divider() {
  return <div className="hidden md:block w-px h-8 bg-slate-200/70 shrink-0" />
}

// ── Single Search Field ──────────────────────────────────────
function SearchField({ label, value, placeholder, icon: Icon, onClick, active, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start px-5 py-3 rounded-full transition-all duration-200 w-full
                  md:w-auto group ${active ? 'bg-white shadow-lg' : 'hover:bg-white/60'}
                  ${className}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary-600
                       transition-colors duration-150 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </span>
      <span className={`text-sm font-medium mt-0.5 whitespace-nowrap ${value ? 'text-slate-800' : 'text-slate-400'}`}>
        {value || placeholder}
      </span>
    </button>
  )
}

// ── Location Dropdown ────────────────────────────────────────
function LocationDropdown({ value, onChange, onClose }) {
  const [query, setQuery] = useState('')
  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  )
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit  ={{ opacity: 0, y: 10, scale: 0.97   }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-0 mt-3 w-72 glass rounded-2xl shadow-glass-lg overflow-hidden z-20"
    >
      <div className="p-3 border-b border-slate-100">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher une ville…"
          className="input-field text-sm"
        />
      </div>
      <ul className="max-h-52 overflow-y-auto py-1">
        {filtered.map((city) => (
          <li key={city}>
            <button
              type="button"
              onClick={() => { onChange(city); onClose() }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors
                          ${value === city
                            ? 'bg-primary-50 text-primary-600 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'}`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-400" />
              {city}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ── Date Picker Dropdown (simplified) ───────────────────────
function DateDropdown({ label, value, onChange, onClose, min }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit  ={{ opacity: 0, y: 10, scale: 0.97   }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-0 mt-3 w-72 glass rounded-2xl shadow-glass-lg p-4 z-20"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{label}</p>
      <input
        type="date"
        value={value || ''}
        min={min || new Date().toISOString().split('T')[0]}
        onChange={(e) => { onChange(e.target.value); onClose() }}
        className="input-field"
      />
    </motion.div>
  )
}

// ── Guests Dropdown ──────────────────────────────────────────
function GuestsDropdown({ adults, setAdults, children, setChildren, onClose }) {
  const Counter = ({ label, hint, value, onInc, onDec, min = 0 }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={onDec}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center
                     text-slate-600 disabled:opacity-30 hover:border-primary-400 hover:text-primary-600
                     transition-colors duration-150"
        >
          <Minus className="w-3.5 h-3.5" />
        </motion.button>
        <span className="w-5 text-center text-sm font-bold text-slate-800">{value}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={onInc}
          className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center
                     text-slate-600 hover:border-primary-400 hover:text-primary-600
                     transition-colors duration-150"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit  ={{ opacity: 0, y: 10, scale: 0.97   }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 mt-3 w-72 glass rounded-2xl shadow-glass-lg p-4 z-20"
    >
      <Counter
        label="Adultes" hint="13 ans et plus"
        value={adults}    min={1}
        onInc={() => setAdults((v) => v + 1)}
        onDec={() => setAdults((v) => Math.max(1, v - 1))}
      />
      <Counter
        label="Enfants" hint="2 à 12 ans"
        value={children}
        onInc={() => setChildren((v) => v + 1)}
        onDec={() => setChildren((v) => Math.max(0, v - 1))}
      />
      <button
        type="button"
        onClick={onClose}
        className="mt-3 btn-primary w-full justify-center text-xs py-2"
      >
        Appliquer
      </button>
    </motion.div>
  )
}

// ── Main SearchBar ───────────────────────────────────────────
export default function SearchBar({ onSearch, className = '' }) {
  const [location,  setLocation]  = useState('')
  const [checkIn,   setCheckIn]   = useState('')
  const [checkOut,  setCheckOut]  = useState('')
  const [adults,    setAdults]    = useState(2)
  const [kids,      setKids]      = useState(0)
  const [openPanel, setOpenPanel] = useState(null) // 'location' | 'checkin' | 'checkout' | 'guests'

  const barRef = useRef(null)

  // Close panels on outside click
  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target))
        setOpenPanel(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (panel) => setOpenPanel((p) => (p === panel ? null : panel))

  const guestLabel =
    adults + kids === 1 ? '1 voyageur' : `${adults + kids} voyageurs`

  const handleSubmit = (e) => {
    e.preventDefault()
    setOpenPanel(null)
    onSearch?.({ location, checkIn, checkOut, guests: adults + kids })
  }

  return (
    <form
      ref={barRef}
      onSubmit={handleSubmit}
      className={`relative flex flex-col md:flex-row items-stretch md:items-center
                  glass rounded-full shadow-glass-lg p-1.5 gap-1 w-full max-w-3xl
                  ${className}`}
    >
      {/* Location */}
      <div className="relative flex-1">
        <SearchField
          label="Destination"
          icon={MapPin}
          value={location}
          placeholder="Où souhaitez-vous aller ?"
          onClick={() => toggle('location')}
          active={openPanel === 'location'}
          className="w-full"
        />
        <AnimatePresence>
          {openPanel === 'location' && (
            <LocationDropdown
              value={location}
              onChange={setLocation}
              onClose={() => setOpenPanel(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* Check-in */}
      <div className="relative">
        <SearchField
          label="Arrivée"
          icon={Calendar}
          value={fmtDate(checkIn)}
          placeholder="Ajouter date"
          onClick={() => toggle('checkin')}
          active={openPanel === 'checkin'}
        />
        <AnimatePresence>
          {openPanel === 'checkin' && (
            <DateDropdown
              label="Date d'arrivée"
              value={checkIn}
              onChange={(v) => { setCheckIn(v); if (checkOut && v >= checkOut) setCheckOut('') }}
              onClose={() => setOpenPanel(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* Check-out */}
      <div className="relative">
        <SearchField
          label="Départ"
          icon={Calendar}
          value={fmtDate(checkOut)}
          placeholder="Ajouter date"
          onClick={() => toggle('checkout')}
          active={openPanel === 'checkout'}
        />
        <AnimatePresence>
          {openPanel === 'checkout' && (
            <DateDropdown
              label="Date de départ"
              value={checkOut}
              onChange={setCheckOut}
              onClose={() => setOpenPanel(null)}
              min={checkIn || undefined}
            />
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* Guests */}
      <div className="relative">
        <SearchField
          label="Voyageurs"
          icon={Users}
          value={adults + kids > 0 ? guestLabel : null}
          placeholder="Ajouter"
          onClick={() => toggle('guests')}
          active={openPanel === 'guests'}
        />
        <AnimatePresence>
          {openPanel === 'guests' && (
            <GuestsDropdown
              adults={adults}    setAdults={setAdults}
              children={kids}    setChildren={setKids}
              onClose={() => setOpenPanel(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Search CTA */}
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: '0 10px 30px rgba(99,102,241,0.4)' }}
        whileTap={{ scale: 0.96 }}
        type="submit"
        className="ml-1 flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white
                   bg-gradient-to-r from-primary-500 to-primary-600
                   shadow-lg transition-all duration-200 shrink-0"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Rechercher</span>
      </motion.button>
    </form>
  )
}
