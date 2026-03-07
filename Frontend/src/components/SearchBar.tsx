/**
 * SearchBar.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Hero search bar with three segments: Location · Dates · Guests.
 *
 * Features:
 *  • Glassmorphism pill container
 *  • Animated guests popover (Framer Motion)
 *  • Full navigation to /search with query params
 *  • Mobile: stacks vertically; Desktop: single row pill
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, Search, Minus, Plus } from 'lucide-react'

// ─── Guest counter sub-component ──────────────────────────────────────────────
interface GuestRowProps {
  label: string
  subLabel: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}

const GuestRow: React.FC<GuestRowProps> = ({ label, subLabel, value, min = 0, max = 10, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-400">{subLabel}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-colors disabled:opacity-40"
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center font-semibold text-slate-800 text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-colors disabled:opacity-40"
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
)

// ─── Main SearchBar ────────────────────────────────────────────────────────────
const SearchBar: React.FC = () => {
  const navigate = useNavigate()

  // ── Form state — these map 1:1 to `PropertyQuery` DTO ─────────────────
  const [location, setLocation] = useState('')
  const [checkIn,  setCheckIn]  = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults,   setAdults]   = useState(1)
  const [kids,     setKids]     = useState(0)
  const [pets,     setPets]     = useState(0)

  const [guestsOpen, setGuestsOpen] = useState(false)
  const guestsRef = useRef<HTMLDivElement>(null)

  const totalGuests = adults + kids + pets
  const guestLabel  = totalGuests === 0
    ? 'Add guests'
    : `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`

  // Close guests popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Navigate to /search with all params ──────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams()
    // TODO: these param names should match your backend's PropertyQuery fields
    if (location) params.set('location', location)
    if (checkIn)  params.set('checkIn',  checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (adults)   params.set('adults',   String(adults))
    if (kids)     params.set('kids',     String(kids))
    if (pets)     params.set('pets',     String(pets))
    navigate(`/search?${params.toString()}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="w-full max-w-3xl">
      {/* ── Pill container ─────────────────────────────────────────────── */}
      <div className="
        flex flex-col md:flex-row items-stretch md:items-center
        bg-white/95 backdrop-blur-md
        rounded-2xl md:rounded-full
        shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)]
        overflow-visible
        p-2 gap-1
      ">

        {/* ── Location ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center gap-2 px-4 py-2 md:py-1 hover:bg-slate-50 rounded-xl md:rounded-full transition-colors group">
          <MapPin size={18} className="text-brand-500 shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
            <input
              type="text"
              placeholder="City, neighbourhood…"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

        {/* ── Check-in ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2 md:py-1 hover:bg-slate-50 rounded-xl md:rounded-full transition-colors">
          <Calendar size={18} className="text-brand-500 shrink-0" />
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="bg-transparent text-sm text-slate-800 outline-none font-medium w-32 cursor-pointer"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

        {/* ── Check-out ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2 md:py-1 hover:bg-slate-50 rounded-xl md:rounded-full transition-colors">
          <Calendar size={18} className="text-brand-400 shrink-0" />
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={e => setCheckOut(e.target.value)}
              className="bg-transparent text-sm text-slate-800 outline-none font-medium w-32 cursor-pointer"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

        {/* ── Guests popover ───────────────────────────────────────────── */}
        <div ref={guestsRef} className="relative">
          <button
            type="button"
            onClick={() => setGuestsOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 md:py-1 hover:bg-slate-50 rounded-xl md:rounded-full transition-colors w-full text-left"
          >
            <Users size={18} className="text-brand-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guests</p>
              <p className={`text-sm font-medium ${totalGuests ? 'text-slate-800' : 'text-slate-400'}`}>
                {guestLabel}
              </p>
            </div>
          </button>

          {/* Guests popover panel */}
          <AnimatePresence>
            {guestsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full md:bottom-auto md:top-full right-0 mt-2 mb-2 md:mb-0 w-72 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-4 z-20 divide-y divide-slate-100"
              >
                <GuestRow label="Adults"   subLabel="Ages 13 +" value={adults} min={1} max={6} onChange={setAdults} />
                <GuestRow label="Children" subLabel="Ages 2–12"  value={kids}   min={0} max={4} onChange={setKids}   />
                <GuestRow label="Pets"     subLabel="Service animals always welcome" value={pets} min={0} max={3} onChange={setPets} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Search button ────────────────────────────────────────────── */}
        <motion.button
          type="button"
          onClick={handleSearch}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="
            flex items-center justify-center gap-2
            px-6 py-3 md:py-2.5
            bg-gradient-to-r from-brand-500 to-brand-600
            hover:from-brand-600 hover:to-brand-700
            text-white font-semibold text-sm rounded-xl md:rounded-full
            shadow-lg shadow-brand-500/40
            transition-all duration-200
            shrink-0
          "
        >
          <Search size={17} />
          <span className="md:hidden lg:inline">Search</span>
        </motion.button>
      </div>
    </div>
  )
}

export default SearchBar

