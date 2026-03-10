import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Star, BedDouble, Bath, Maximize2,
  Heart, Eye, Share2, Wifi, Car, Waves, CheckCircle2
} from 'lucide-react'

// ── Amenity icon map ─────────────────────────────────────────
const AMENITY_ICONS = {
  'WiFi':       Wifi,
  'Parking':    Car,
  'Piscine':    Waves,
}

// ── Badge color map ──────────────────────────────────────────
const BADGE_COLORS = {
  emerald: 'bg-emerald-500 text-white',
  primary: 'bg-primary-500 text-white',
}

export default function PropertyCard({ property, index = 0 }) {
  const [liked,    setLiked]    = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const {
    title, location, price, currency, period, bedrooms, bathrooms, area,
    rating, reviewCount, type, badge, badgeColor, available, image,
    host, amenities,
  } = property

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden
                 shadow-md hover:shadow-card-hover transition-shadow duration-300 cursor-pointer"
    >
      {/* ── Image Container ──────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {/* Shimmer skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-shimmer"
               style={{ backgroundImage: 'linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%)',
                        backgroundSize: '1000px 100%' }} />
        )}

        {/* Property image */}
        <motion.img
          src={image}
          alt={title}
          onLoad={() => setImgLoaded(true)}
          variants={{ hover: { scale: 1.07 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                      ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-card-gradient opacity-80" />

        {/* ── Top Actions ──────────────────────────────────── */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Badge */}
          {badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              className={`badge text-[11px] ${BADGE_COLORS[badgeColor] || 'bg-white text-slate-700'}
                          shadow-md backdrop-blur-sm`}
            >
              {badge}
            </motion.span>
          )}
          {!badge && <span />}

          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
            className="w-8 h-8 rounded-full glass flex items-center justify-center shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                liked ? 'fill-red-500 text-red-500' : 'text-slate-600'
              }`}
            />
          </motion.button>
        </div>

        {/* ── Availability Tag ─────────────────────────────── */}
        <div className="absolute bottom-3 left-3">
          {available ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300
                             bg-emerald-900/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Disponible
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-300
                             bg-slate-900/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
              Sur demande
            </span>
          )}
        </div>

        {/* ── Price Tag (animated on hover) ────────────────── */}
        <motion.div
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 10 }}
          className="absolute bottom-3 right-3 glass rounded-xl px-3 py-1.5 shadow-md"
        >
          <p className="text-xs text-slate-500 leading-none mb-0.5">{type}</p>
          <p className="text-sm font-extrabold text-slate-900 leading-none">
            {price.toLocaleString('fr-TN')} {currency}
            <span className="font-normal text-[10px] text-slate-500">/{period}</span>
          </p>
        </motion.div>
      </div>

      {/* ── Card Body ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title + Location */}
        <div>
          <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-600
                         transition-colors duration-150">
            {title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-primary-400 shrink-0" />
            <span className="text-xs text-slate-500 truncate">{location}</span>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-slate-400" />
            {bedrooms} ch.
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            {bathrooms} sdb.
          </span>
          <span className="w-px h-3 bg-slate-200" />
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            {area} m²
          </span>
        </div>

        {/* Amenity pills */}
        <div className="flex flex-wrap gap-1.5">
          {amenities.slice(0, 3).map((a) => {
            const Icon = AMENITY_ICONS[a]
            return (
              <span key={a} className="inline-flex items-center gap-1 text-[10px] font-medium
                                       bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {Icon && <Icon className="w-2.5 h-2.5" />}
                {a}
              </span>
            )
          })}
          {amenities.length > 3 && (
            <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">
              +{amenities.length - 3}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Host */}
          <div className="flex items-center gap-2">
            <img
              src={host.avatar}
              alt={host.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-100"
            />
            <span className="text-xs text-slate-500 font-medium">{host.name}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">{rating}</span>
            <span className="text-[10px] text-slate-400">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* ── Hover Action Strip ───────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 8 }}
          className="absolute bottom-0 inset-x-0 pointer-events-none group-hover:pointer-events-auto
                     px-4 pb-4 flex items-center justify-end gap-2"
        >
          {/* These appear on hover via the parent motion.article's "hover" variant */}
        </motion.div>
      </AnimatePresence>
    </motion.article>
  )
}
