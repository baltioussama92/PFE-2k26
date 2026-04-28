import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star, Bed, Bath, Maximize2 } from 'lucide-react'

const BADGE_STYLES = {
  emerald: 'bg-emerald-500/90 text-primary-50',
  primary: 'bg-primary-500/90 text-primary-50',
  amber:   'bg-amber-500/90   text-primary-50',
}

export default function PropertyCard({
  property,
  id,
  title,
  location,
  price,
  rating,
  image,
  type,
  liked: likedProp,
  onToggleLike,
}) {
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()

  // Support both object-style and individual props
  const p = property ?? { id, title, location, price, rating, image, type }
  const isLiked = likedProp ?? liked

  const handleClick = () => {
    if (p.id) navigate(`/property/${p.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={handleClick}
      className="group bg-primary-100 rounded-2xl border border-primary-200 overflow-hidden
                 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />

        {/* Badge */}
        {p.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full
                            backdrop-blur-sm ${BADGE_STYLES[p.badgeColor] || BADGE_STYLES.primary}`}>
            {p.badge}
          </span>
        )}

        {/* Favourite */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (onToggleLike) {
              onToggleLike(p)
              return
            }
            setLiked((v) => !v)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary-100/80 backdrop-blur-sm
                     flex items-center justify-center transition-colors hover:bg-primary-100 shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-primary-600'
            }`}
          />
        </button>

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 bg-primary-100/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <p className="text-sm font-extrabold text-primary-900 leading-none">
            {(p.price ?? 0).toLocaleString('fr-TN')} {p.currency || 'DT'}
            {p.period && (
              <span className="text-[10px] font-normal text-primary-500">/{p.period}</span>
            )}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-primary-900 text-sm truncate">{p.title}</h3>

        <div className="flex items-center gap-1 mt-1 mb-3">
          <MapPin className="w-3 h-3 text-primary-400" />
          <span className="text-xs text-primary-500 truncate">{p.location}</span>
        </div>

        {/* Stats */}
        {(p.bedrooms || p.bathrooms || p.area) && (
          <div className="flex items-center gap-3 text-xs text-primary-500 mb-3">
            {p.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" /> {p.bedrooms}
              </span>
            )}
            {p.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {p.bathrooms}
              </span>
            )}
            {p.area != null && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> {p.area} m²
              </span>
            )}
          </div>
        )}

        {/* Footer: rating + type */}
        <div className="flex items-center justify-between pt-3 border-t border-primary-200">
          {p.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-primary-800">{p.rating}</span>
              {p.reviewCount != null && (
                <span className="text-[10px] text-primary-400">({p.reviewCount})</span>
              )}
            </div>
          )}
          {p.type && (
            <span className="text-[10px] font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
              {p.type}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
