/**
 * SearchBar.tsx â€” Airbnb-style expandable hero search bar
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * Two visual states driven by a single `isExpanded` boolean:
 *
 *  COLLAPSED  â†’  Sleek centered pill  "Anywhere Â· Any week Â· Add guests ðŸ”"
 *  EXPANDED   â†’  Full segmented form  Location | Check-in | Check-out | Guests
 *
 * Transitions are powered by Framer Motion's `layout` prop which morphs the
 * pill shape into a card and back in a single spring animation. The four input
 * segments track an `activeSegment` state for individual focus rings.
 *
 * A fixed dark overlay fades in behind the bar and collapses it on click.
 *
 * API hookup points are marked // TODO: API
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

import React, { useState, useRef, useEffect, useId } from 'react'
import { createPortal }   from 'react-dom'
import { useNavigate }    from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, Search, Minus, Plus, X } from 'lucide-react'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Segment = 'location' | 'checkin' | 'checkout' | 'guests' | null

// â”€â”€â”€ Sub-component: guest counter row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface GuestRowProps {
  label: string
  sub: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}

const GuestRow: React.FC<GuestRowProps> = ({ label, sub, value, min = 0, max = 10, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
    <div className="leading-tight">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center
                   text-slate-600 transition-colors
                   hover:border-brand-500 hover:text-brand-600
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={13} />
      </button>
      <span className="w-5 text-center text-sm font-bold text-slate-800 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center
                   text-slate-600 transition-colors
                   hover:border-brand-500 hover:text-brand-600
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={13} />
      </button>
    </div>
  </div>
)

// â”€â”€â”€ Segment wrapper â€” adds focus ring when active â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface SegmentProps {
  id: Segment
  active: boolean
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
}

const Segment: React.FC<SegmentProps> = ({ active, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'relative flex flex-col items-start px-5 py-3 rounded-2xl transition-all duration-150 text-left',
      'hover:bg-slate-50 focus-visible:outline-none',
      active
        ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.12)] ring-1 ring-slate-200/60 z-10 scale-[1.01]'
        : 'bg-transparent',
      className,
    ].join(' ')}
  >
    {children}
  </button>
)

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const uid = useId()   // stable id for aria attributes

  // â”€â”€ Form state â€” maps directly to `PropertyQuery` DTO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [location, setLocation] = useState('')
  const [checkIn,  setCheckIn]  = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults,   setAdults]   = useState(1)
  const [kids,     setKids]     = useState(0)
  const [pets,     setPets]     = useState(0)

  // â”€â”€ UI state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [isExpanded,     setIsExpanded]     = useState(false)
  const [activeSegment,  setActiveSegment]  = useState<Segment>(null)
  const [guestsOpen,     setGuestsOpen]     = useState(false)

  const containerRef  = useRef<HTMLDivElement>(null)
  const locationRef   = useRef<HTMLInputElement>(null)

  // Derived display values for the collapsed pill summary
  const totalGuests = adults + kids + pets
  const pillLocation = location.trim() || 'Anywhere'
  const pillDates    = checkIn ? (checkOut ? `${fmt(checkIn)} â€“ ${fmt(checkOut)}` : fmt(checkIn)) : 'Any week'
  const pillGuests   = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'

  // â”€â”€ Expand and focus first segment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const expand = (seg: Segment = 'location') => {
    setIsExpanded(true)
    setActiveSegment(seg)
    if (seg === 'guests') setGuestsOpen(true)
    // Auto-focus the location input when opening on that segment
    if (seg === 'location') requestAnimationFrame(() => locationRef.current?.focus())
  }

  // â”€â”€ Collapse everything â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const collapse = () => {
    setIsExpanded(false)
    setActiveSegment(null)
    setGuestsOpen(false)
  }

  // â”€â”€ Close on outside click â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!isExpanded) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        collapse()
      }
    }
    // Slight delay so the expand click itself is ignored
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [isExpanded])

  // â”€â”€ Keyboard: Escape collapses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') collapse() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // â”€â”€ Navigate to /search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSearch = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: API â€” param names must match your backend PropertyQuery fields
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn)  params.set('checkIn',  checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', String(adults))
    if (kids) params.set('kids', String(kids))
    if (pets) params.set('pets',  String(pets))
    collapse()
    navigate(`/search?${params.toString()}`)
  }

  return (
    <>
      {/* â”€â”€ Portal overlay â€” renders directly under <body> â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          Sits below the search bar (z-20) so it dims the hero without blocking
          the bar itself (z-30).                                              */}
      {createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="hero-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={collapse}
              className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px]"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* â”€â”€ Search bar container â€” z-30 keeps it above the overlay â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        ref={containerRef}
        className="relative z-30 w-full flex justify-center"
        role="search"
        aria-expanded={isExpanded}
        aria-label="Property search"
      >
        <motion.div
          /* layout makes Framer Motion automatically tween width/height/borderRadius */
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 38 }}
          style={{
            // Morph from full-pill to rounded card
            borderRadius: isExpanded ? 24 : 9999,
            // Expand to full content width when active
            width: isExpanded ? 'min(760px, 92vw)' : undefined,
          }}
          className={[
            'overflow-hidden',
            isExpanded
              ? 'bg-white shadow-[0_24px_72px_-8px_rgba(0,0,0,0.32)]'
              : 'bg-white/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.28)] cursor-pointer hover:bg-white transition-colors duration-200',
          ].join(' ')}
        >
          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
              COLLAPSED PILL
          â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <AnimatePresence mode="wait" initial={false}>
            {!isExpanded && (
              <motion.div
                key="pill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => expand('location')}
                className="flex items-center gap-0 px-2.5 py-1"
              >
                {/* Left: summary text */}
                <div className="flex items-center divide-x divide-slate-300/60 flex-1 pl-3">
                  <span className="pr-6 text-sm font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-none">
                    {pillLocation}
                  </span>
                  <span className="px-6 text-sm font-medium text-slate-500 hidden sm:block">
                    {pillDates}
                  </span>
                  <span className={`pl-6 text-sm font-medium ${totalGuests > 0 ? 'text-slate-700' : 'text-slate-400'} hidden md:block`}>
                    {pillGuests}
                  </span>
                </div>

                {/* Right: search button */}
                <div className="ml-2 p-2.5 bg-indigo-500 rounded-full shadow-md shadow-indigo-500/45 shrink-0">
                  <Search size={15} className="text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
            )}

            {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
                EXPANDED FORM
            â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {isExpanded && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.06 }}
              >
                {/* â”€â”€ Top row: 4 segments + search button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="flex items-stretch p-2 gap-1">

                  {/* LOCATION */}
                  <div
                    onClick={() => { setActiveSegment('location'); locationRef.current?.focus() }}
                    className={[
                      'flex-[1.8] flex flex-col px-5 py-3 rounded-2xl cursor-text transition-all duration-150',
                      activeSegment === 'location'
                        ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.10)] ring-1 ring-slate-200/50 z-10'
                        : 'hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <label
                      htmlFor={`${uid}-location`}
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 cursor-pointer select-none"
                    >
                      Location
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand-500 shrink-0" />
                      <input
                        id={`${uid}-location`}
                        ref={locationRef}
                        type="text"
                        value={location}
                        onClick={e => { e.stopPropagation(); setActiveSegment('location') }}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Where are you going?"
                        autoComplete="off"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
                      />
                      {/* Clear button */}
                      {location && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setLocation('') }}
                          className="p-0.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors shrink-0"
                          aria-label="Clear location"
                        >
                          <X size={10} className="text-slate-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'location' || activeSegment === 'checkin' ? 0 : 1 }}
                  />

                  {/* CHECK-IN */}
                  <Segment
                    id="checkin"
                    active={activeSegment === 'checkin'}
                    onClick={() => setActiveSegment('checkin')}
                    className="flex-1 min-w-0"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Check-in</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-500 shrink-0" />
                      <input
                        id={`${uid}-checkin`}
                        type="date"
                        value={checkIn}
                        onClick={e => { e.stopPropagation(); setActiveSegment('checkin') }}
                        onChange={e => setCheckIn(e.target.value)}
                        className="bg-transparent text-sm font-medium text-slate-800 outline-none w-full cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </Segment>

                  {/* Divider */}
                  <div className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'checkin' || activeSegment === 'checkout' ? 0 : 1 }}
                  />

                  {/* CHECK-OUT */}
                  <Segment
                    id="checkout"
                    active={activeSegment === 'checkout'}
                    onClick={() => setActiveSegment('checkout')}
                    className="flex-1 min-w-0"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Check-out</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-400 shrink-0" />
                      <input
                        id={`${uid}-checkout`}
                        type="date"
                        value={checkOut}
                        min={checkIn || undefined}
                        onClick={e => { e.stopPropagation(); setActiveSegment('checkout') }}
                        onChange={e => setCheckOut(e.target.value)}
                        className="bg-transparent text-sm font-medium text-slate-800 outline-none w-full cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </Segment>

                  {/* Divider */}
                  <div className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'checkout' || activeSegment === 'guests' ? 0 : 1 }}
                  />

                  {/* GUESTS */}
                  <div className="relative flex-1 min-w-0">
                    <Segment
                      id="guests"
                      active={activeSegment === 'guests'}
                      onClick={(e) => {
                        e?.stopPropagation()
                        setActiveSegment('guests')
                        setGuestsOpen(v => !v)
                      }}
                      className="w-full"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Guests</span>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-brand-500 shrink-0" />
                        <span className={`text-sm font-medium ${totalGuests > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                          {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
                        </span>
                      </div>
                    </Segment>

                    {/* â”€â”€ Guests popover â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    <AnimatePresence>
                      {guestsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onClick={e => e.stopPropagation()}
                          className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white rounded-2xl shadow-card-hover border border-slate-100 px-5 py-2 z-40"
                        >
                          <GuestRow label="Adults"   sub="Ages 13+"                      value={adults} min={1} max={6} onChange={setAdults} />
                          <GuestRow label="Children" sub="Ages 2â€“12"                     value={kids}   min={0} max={4} onChange={setKids}   />
                          <GuestRow label="Pets"     sub="Service animals always welcome" value={pets}   min={0} max={3} onChange={setPets}   />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ Search button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                  <div className="flex items-center pl-1 shrink-0">
                    <motion.button
                      type="button"
                      onClick={handleSearch}
                      whileTap={{ scale: 0.93 }}
                      whileHover={{ scale: 1.04 }}
                      className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600
                                 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm rounded-2xl
                                 shadow-lg shadow-brand-500/40 transition-all duration-200"
                    >
                      <Search size={16} strokeWidth={2.5} />
                      <span className="hidden lg:inline">Search</span>
                    </motion.button>
                  </div>
                </div>

                {/* â”€â”€ Subtle close hint â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-[11px] text-slate-400 pb-2 select-none"
                >
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-100 font-mono text-slate-500">Esc</kbd> or click outside to close
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

// â”€â”€â”€ Helper: format "2026-03-15" â†’ "Mar 15" â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function fmt(iso: string): string {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m) - 1]
  return `${month} ${parseInt(d)}`
}

export default SearchBar
