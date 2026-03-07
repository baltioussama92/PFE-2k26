/**
 * PropertyCard.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Premium property card with:
 *  • Framer Motion hover: scale + shadow expansion + image zoom
 *  • Badges: "Top Rated" (rating ≥ 4.7) and "Instant Booking"
 *  • Favorite toggle button (heart)
 *  • Connect `instantBooking` to your PropertyResponse DTO later
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Heart, Zap, Award } from 'lucide-react'

// ─── Props ────────────────────────────────────────────────────────────────────
export interface PropertyCardProps {
  id: string | number
  title: string
  location: string
  price: number
  /** Rating out of 5 */
  rating: number
  /** Review count – optional, shown when > 0 */
  reviewCount?: number
  image: string
  type: string
  /** Show "Instant Booking" badge */
  instantBooking?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────
const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  rating,
  reviewCount,
  image,
  type,
  instantBooking = false,
}) => {
  // TODO: wire `isFavorited` to your bookmarks / wishlist API call
  const [favorited, setFavorited] = useState(false)

  const isTopRated = rating >= 4.7

  return (
    <motion.div
      // ── Hover animation: lift card + expand shadow ─────────────────────
      whileHover={{ y: -6, boxShadow: '0 24px 64px -4px rgba(0,0,0,.18)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer"
    >
      {/* ── Link wraps everything except the heart button ──────────────── */}
      <Link to={`/property/${id}`} className="block">

        {/* ── Image container ──────────────────────────────────────────── */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            src={image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'}
            alt={title}
            // Zoom on card hover via group-hover
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Dark gradient overlay on hover for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Property type pill */}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full">
            {type}
          </span>

          {/* ── Badges (top-right) ────────────────────────────────────── */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {isTopRated && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-[11px] font-bold rounded-full shadow">
                <Award size={10} />
                Top Rated
              </span>
            )}
            {instantBooking && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-500 text-white text-[11px] font-bold rounded-full shadow">
                <Zap size={10} />
                Instant
              </span>
            )}
          </div>
        </div>

        {/* ── Card body ────────────────────────────────────────────────── */}
        <div className="p-4">
          {/* Title + rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-slate-800">{rating.toFixed(1)}</span>
              {reviewCount != null && reviewCount > 0 && (
                <span className="text-xs text-slate-400">({reviewCount})</span>
              )}
            </div>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin size={12} className="text-brand-400 shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-slate-900">${price.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">/ night</span>
          </div>
        </div>
      </Link>

      {/* ── Favorite button (outside the Link) ───────────────────────────── */}
      <button
        onClick={(e) => {
          e.preventDefault()
          // TODO: call bookmarkService.toggle(id) here
          setFavorited(v => !v)
        }}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute bottom-[52px] right-4 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Heart
          size={16}
          className={favorited ? 'fill-red-500 text-red-500' : 'text-slate-400'}
        />
      </button>
    </motion.div>
  )
}

export default PropertyCard

