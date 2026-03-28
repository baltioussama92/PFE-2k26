import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid3X3, List, TrendingUp, Loader2 } from 'lucide-react'
import PropertyCard from './PropertyCard'
import { propertyService } from '../../services/propertyService'

// ── Sort Options ─────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'default',   label: 'Recommandés'          },
  { value: 'price_asc', label: 'Prix croissant'        },
  { value: 'price_desc', label: 'Prix décroissant'     },
  { value: 'rating',    label: 'Mieux notés'           },
]

// ── Sort function ─────────────────────────────────────────────
function sortProperties(props, sort) {
  const arr = [...props]
  if (sort === 'price_asc')  return arr.sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') return arr.sort((a, b) => b.price - a.price)
  if (sort === 'rating')     return arr.sort((a, b) => b.rating - a.rating)
  return arr
}

function filterProperties(props, type) {
  if (!type || type === 'Tous') return props
  return props.filter((p) => p.type === type)
}

// Normalize backend → frontend property shape
const normalizeProperty = (p) => ({
  ...p,
  price: p.price ?? p.pricePerNight,
  image: p.image ?? (p.images?.length ? p.images[0] : null),
  currency: p.currency || 'TND',
  period: p.period || (p.pricePerNight != null ? 'nuit' : 'mois'),
})

export default function PropertyGrid({ title = 'Propriétés en vedette', searchResult = null, searchFilters = null }) {
  const [sort,    setSort]    = useState('default')
  const [type,    setType]    = useState('Tous')
  const [layout,  setLayout]  = useState('grid') // 'grid' | 'list'
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    propertyService.list()
      .then(data => {
        if (!active) return
        setApiData(data.map(normalizeProperty))
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  // Helper function to check if property matches search filters
  function matchesSearchFilters(property, filters) {
    if (!filters) return true
    
    if (filters.location) {
      if (!property.location || !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
    }
    
    if (filters.checkIn && filters.checkOut) {
      // Check if property is available during the dates
      const checkInDate = new Date(filters.checkIn)
      const checkOutDate = new Date(filters.checkOut)
      
      // For now, we'll just check if property is marked as available
      // In a real app, this would check against booked dates
      if (property.available === false) {
        return false
      }
    }
    
    if (filters.guests && property.maxGuests) {
      if (parseInt(filters.guests) > parseInt(property.maxGuests)) {
        return false
      }
    }
    
    return true
  }

  const source   = searchResult ?? apiData ?? []
  const filtered = searchFilters 
    ? source.filter(p => matchesSearchFilters(p, searchFilters)) 
    : source
  
  const propertyTypes = ['Tous', ...Array.from(new Set(filtered.map((p) => p.type).filter(Boolean)))]
  const typeFiltered = filterProperties(filtered, type)
  const sorted   = sortProperties(typeFiltered, sort)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

      {/* ── Section Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest
                       text-primary-600 mb-2"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Annonces populaires
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-2xl sm:text-3xl font-extrabold text-primary-900"
          >
            {title}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="flex items-center gap-2"
        >
          {/* Sort select */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-primary-200 bg-primary-100 px-4 py-2 text-xs text-primary-800 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200 pr-8 cursor-pointer"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                                          text-primary-400 pointer-events-none" />
          </div>

          {/* Layout toggle */}
          <div className="flex items-center border border-primary-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 transition-colors duration-150 ${
                layout === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-primary-400 hover:bg-primary-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 transition-colors duration-150 ${
                layout === 'list' ? 'bg-primary-50 text-primary-600' : 'text-primary-400 hover:bg-primary-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Type Filter Pills ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {propertyTypes.map((t) => (
          <motion.button
            key={t}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setType(t)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
              type === t
                ? 'text-primary-50'
                : 'bg-primary-100 text-primary-600 border border-primary-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {type === t && (
              <motion.div
                layoutId="type-pill"
                className="absolute inset-0 rounded-full bg-primary-500"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            {t}
          </motion.button>
        ))}
        <span className="ml-auto text-xs text-primary-400 self-center">
          {sorted.length} résultat{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Property Grid ─────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-primary-400"
        >
          <p className="text-lg font-semibold">Aucune propriété trouvée</p>
          <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
        </motion.div>
      ) : (
        <div
          className={`grid gap-5 ${
            layout === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-2xl'
          }`}
        >
          {sorted.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── Load More ─────────────────────────────────────── */}
      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(164,131,116,0.25)' }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-100 px-5 py-3 text-sm font-semibold text-primary-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
        >
          Voir plus de propriétés
        </motion.button>
      </div>
    </section>
  )
}
