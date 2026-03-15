import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Heart, Search, MapPin, Clock, Star, ArrowRight,
  Bed, Bath, Maximize2, X, ChevronRight, ChevronLeft, TrendingUp
} from 'lucide-react'
import {
  UPCOMING_STAYS, SAVED_HOMES, SEARCH_HISTORY
} from '../../data/dashboardData'

// ── Countdown timer ───────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
    }
  }
  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000)
    return () => clearInterval(id)
  }, [targetDate])

  return time
}

// ── Countdown display ─────────────────────────────────────────
function CountdownCell({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-primary-50/20 rounded-xl px-2.5 py-1.5">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y:  0, opacity: 1 }}
        className="text-lg font-extrabold text-primary-50 leading-none"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-[9px] text-primary-100 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  )
}

// ── Upcoming Stay Card ────────────────────────────────────────
function StayCard({ stay, isFirst }) {
  const t = useCountdown(stay.checkIn)
  const urgent = t.days <= 3

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x:  0 }}
      whileHover={{ y: -4 }}
      style={{ scrollSnapAlign: 'start', flexShrink: 0, width: 300 }}
      className={`relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br
                  ${urgent
                    ? 'from-primary-600 to-primary-800'
                    : 'from-primary-700 to-primary-900'}`}
    >
      {/* Background image */}
      <img src={stay.image} alt={stay.property}
           className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="relative p-5">
        {isFirst && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary-400/30
                           text-primary-100 px-2.5 py-1 rounded-full mb-3">
            <TrendingUp className="w-3 h-3" /> Prochain séjour
          </span>
        )}

        <h3 className="font-bold text-primary-50 text-sm mb-0.5 truncate">{stay.property}</h3>
        <div className="flex items-center gap-1 mb-4">
          <MapPin className="w-3 h-3 text-primary-300" />
          <span className="text-xs text-primary-200">{stay.location}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-xs text-primary-50/70 mb-4">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{new Date(stay.checkIn).toLocaleDateString('fr-FR',  {day:'2-digit', month:'short'})}
            → {new Date(stay.checkOut).toLocaleDateString('fr-FR', {day:'2-digit', month:'short', year:'numeric'})}</span>
        </div>

        {/* Countdown */}
        <div>
          <p className="text-[10px] text-primary-50/50 uppercase tracking-widest mb-2">Compte à rebours</p>
          <div className="flex items-center gap-2">
            <CountdownCell value={t.days}    label="j"  />
            <span className="text-primary-50/50 font-bold">:</span>
            <CountdownCell value={t.hours}   label="h"  />
            <span className="text-primary-50/50 font-bold">:</span>
            <CountdownCell value={t.minutes} label="min" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-primary-50">
            {stay.amount.toLocaleString('fr-TN')} TND
          </span>
          <button className="flex items-center gap-1 text-[11px] font-bold text-primary-300
                             hover:text-primary-50 transition-colors">
            Détails <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Saved Home Card ───────────────────────────────────────────
function SavedCard({ home, index }) {
  const [saved, setSaved] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(164,131,116,0.10)' }}
      className="bg-primary-100 rounded-2xl border border-primary-200 overflow-hidden shadow-sm"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={home.image} alt={home.title}
             className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />

        {/* Heart toggle */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setSaved(s => !s)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary-50/90 backdrop-blur-sm
                     flex items-center justify-center shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-primary-400'}`} />
        </motion.button>

        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-primary-50/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
          <p className="text-sm font-extrabold text-primary-900 leading-none">
            {home.price.toLocaleString('fr-TN')}
            <span className="text-[10px] font-normal text-primary-500"> TND/mois</span>
          </p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-primary-900 text-sm truncate">{home.title}</h3>
        <div className="flex items-center gap-1 mt-0.5 mb-3">
          <MapPin className="w-3 h-3 text-primary-400" />
          <span className="text-xs text-primary-500">{home.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-primary-500 mb-4">
          <span className="flex items-center gap-1"><Bed        className="w-3.5 h-3.5" />{home.beds}ch</span>
          <span className="flex items-center gap-1"><Bath       className="w-3.5 h-3.5" />{home.baths}sb</span>
          <span className="flex items-center gap-1"><Maximize2  className="w-3.5 h-3.5" />{home.area}m²</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{home.rating}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(164,131,116,0.25)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2 rounded-xl bg-primary-500 text-primary-50 text-xs font-bold
                     hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          Réserver maintenant <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// ── Main TenantView ──────────────────────────────────────────
export default function TenantView() {
  const scrollRef = useRef(null)

  return (
    <div className="space-y-8">

      {/* ── Upcoming Stays — horizontal scroll ──────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-primary-900">Séjours à venir</h2>
            <p className="text-xs text-primary-400 mt-0.5">{UPCOMING_STAYS.length} réservation{UPCOMING_STAYS.length > 1 ? 's' : ''} confirmée{UPCOMING_STAYS.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -316, behavior: 'smooth' })}
              className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center
                         text-primary-600 hover:bg-primary-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 316, behavior: 'smooth' })}
              className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center
                         text-primary-600 hover:bg-primary-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {UPCOMING_STAYS.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-primary-100 rounded-2xl border border-primary-200
                          border-dashed py-14 text-center">
            <CalendarDays className="w-10 h-10 text-primary-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-primary-500">Aucun séjour à venir</p>
            <p className="text-xs text-primary-400 mt-1">Explorez et réservez votre prochain logement.</p>
            <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary-500 text-primary-50 text-xs font-bold
                               hover:bg-primary-600 transition-colors">
              Explorer les annonces
            </button>
          </div>
        ) : (
          <div
            ref={scrollRef}
            style={{ scrollSnapType: 'x mandatory', gap: 16 }}
            className="flex overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
          >
            {UPCOMING_STAYS.map((stay, i) => (
              <StayCard key={stay.id} stay={stay} isFirst={i === 0} />
            ))}
          </div>
        )}
      </div>

      {/* ── Saved Homes ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-primary-900">Logements sauvegardés</h2>
            <p className="text-xs text-primary-400 mt-0.5">{SAVED_HOMES.length} favoris</p>
          </div>
          <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAVED_HOMES.map((home, i) => (
            <SavedCard key={home.id} home={home} index={i} />
          ))}
        </div>
      </div>

      {/* ── Search History ────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-extrabold text-primary-900 mb-4">Historique de recherche</h2>
        <div className="bg-primary-100 rounded-2xl border border-primary-200 shadow-sm divide-y divide-primary-200">
          {SEARCH_HISTORY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary-50 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <Search className="w-3.5 h-3.5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-800 truncate">{item.query}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-primary-400">
                    <MapPin className="w-3 h-3" />{item.location}
                  </span>
                  {item.price && (
                    <span className="text-[11px] text-primary-400">· max {item.price.toLocaleString('fr-TN')} TND</span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-primary-400">
                    <Clock className="w-3 h-3" />{item.timeAgo}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] bg-primary-100 text-primary-500 px-2 py-0.5 rounded-full">
                  {item.results} résultat{item.results > 1 ? 's' : ''}
                </span>
                <motion.button
                  whileHover={{ x: 2 }}
                  className="opacity-0 group-hover:opacity-100 text-primary-500 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
