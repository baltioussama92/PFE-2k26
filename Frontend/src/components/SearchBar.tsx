import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, MapPin, Minus, Plus, Search, Users, X } from 'lucide-react'

type Segment = 'location' | 'checkin' | 'checkout' | 'guests' | null

interface GuestRowProps {
  label: string
  sub: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}

const GuestRow: React.FC<GuestRowProps> = ({
  label,
  sub,
  value,
  min = 0,
  max = 10,
  onChange,
}) => (
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

interface SegmentProps {
  active: boolean
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
}

const SegmentButton: React.FC<SegmentProps> = ({ active, onClick, children, className = '' }) => (
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

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const uid = useId()

  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [pets, setPets] = useState(0)

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSegment, setActiveSegment] = useState<Segment>(null)
  const [guestsOpen, setGuestsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)

  const totalGuests = adults + kids + pets
  const pillLocation = location.trim() || 'Anywhere'
  const pillDates = checkIn ? (checkOut ? `${fmt(checkIn)} - ${fmt(checkOut)}` : fmt(checkIn)) : 'Any week'
  const pillGuests = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'

  const expand = (segment: Segment = 'location') => {
    setIsExpanded(true)
    setActiveSegment(segment)
    if (segment === 'guests') setGuestsOpen(true)
    if (segment === 'location') requestAnimationFrame(() => locationRef.current?.focus())
  }

  const collapse = () => {
    setIsExpanded(false)
    setActiveSegment(null)
    setGuestsOpen(false)
  }

  useEffect(() => {
    if (!isExpanded) return

    const outsideClickHandler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        collapse()
      }
    }

    const timeoutId = setTimeout(() => document.addEventListener('mousedown', outsideClickHandler), 50)
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', outsideClickHandler)
    }
  }, [isExpanded])

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse()
    }

    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [])

  const handleSearch = (e: React.MouseEvent) => {
    e.stopPropagation()

    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', String(adults))
    if (kids) params.set('kids', String(kids))
    if (pets) params.set('pets', String(pets))

    collapse()
    navigate(`/search?${params.toString()}`)
  }

  return (
    <>
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
              className="fixed inset-0 z-20 bg-transparent"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <div
        ref={containerRef}
        className="relative z-30 w-full flex justify-center"
        role="search"
        aria-expanded={isExpanded}
        aria-label="Property search"
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 38 }}
          style={{
            borderRadius: isExpanded ? 24 : 9999,
            width: isExpanded ? 'min(760px, 92vw)' : undefined,
          }}
          className={[
            'overflow-hidden',
            isExpanded
              ? 'bg-white shadow-[0_24px_72px_-8px_rgba(0,0,0,0.32)]'
              : 'bg-white shadow-[0_8px_40px_rgba(0,0,0,0.28)] cursor-pointer hover:shadow-[0_12px_48px_rgba(0,0,0,0.32)] transition-all duration-200',
          ].join(' ')}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isExpanded && (
              <motion.div
                key="pill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => expand('location')}
                className="flex items-center gap-0 px-2 py-1.5"
              >
                <div className="flex items-center divide-x divide-slate-300/70 flex-1 pl-2">
                  <span className="pr-4 text-sm font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
                    {pillLocation}
                  </span>
                  <span className="px-4 text-sm font-medium text-slate-500 hidden sm:block">{pillDates}</span>
                  <span
                    className={`pl-4 text-sm font-medium ${totalGuests > 0 ? 'text-slate-700' : 'text-slate-400'} hidden md:block`}
                  >
                    {pillGuests}
                  </span>
                </div>

                <div className="ml-2 p-2.5 bg-indigo-500 rounded-full shadow-md shadow-indigo-500/45 shrink-0">
                  <Search size={15} className="text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
            )}

            {isExpanded && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.06 }}
              >
                <div className="flex items-stretch p-2 gap-1">
                  <div
                    onClick={() => {
                      setActiveSegment('location')
                      locationRef.current?.focus()
                    }}
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
                        onClick={e => {
                          e.stopPropagation()
                          setActiveSegment('location')
                        }}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Where are you going?"
                        autoComplete="off"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
                      />
                      {location && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            setLocation('')
                          }}
                          className="p-0.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors shrink-0"
                          aria-label="Clear location"
                        >
                          <X size={10} className="text-slate-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'location' || activeSegment === 'checkin' ? 0 : 1 }}
                  />

                  <SegmentButton
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
                        onClick={e => {
                          e.stopPropagation()
                          setActiveSegment('checkin')
                        }}
                        onChange={e => setCheckIn(e.target.value)}
                        className="bg-transparent text-sm font-medium text-slate-800 outline-none w-full cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </SegmentButton>

                  <div
                    className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'checkin' || activeSegment === 'checkout' ? 0 : 1 }}
                  />

                  <SegmentButton
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
                        onClick={e => {
                          e.stopPropagation()
                          setActiveSegment('checkout')
                        }}
                        onChange={e => setCheckOut(e.target.value)}
                        className="bg-transparent text-sm font-medium text-slate-800 outline-none w-full cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </SegmentButton>

                  <div
                    className="self-center w-px h-8 bg-slate-200/80 shrink-0"
                    style={{ opacity: activeSegment === 'checkout' || activeSegment === 'guests' ? 0 : 1 }}
                  />

                  <div className="relative flex-1 min-w-0">
                    <SegmentButton
                      active={activeSegment === 'guests'}
                      onClick={e => {
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
                    </SegmentButton>

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
                          <GuestRow label="Adults" sub="Ages 13+" value={adults} min={1} max={6} onChange={setAdults} />
                          <GuestRow label="Children" sub="Ages 2-12" value={kids} min={0} max={4} onChange={setKids} />
                          <GuestRow label="Pets" sub="Service animals always welcome" value={pets} min={0} max={3} onChange={setPets} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

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

function fmt(iso: string): string {
  if (!iso) return ''

  const [, month, day] = iso.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`
}

export default SearchBar
