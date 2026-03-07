/**
 * SkeletonLoader.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Animated shimmer skeleton cards shown while property data is loading.
 *
 * Usage:
 *   import SkeletonLoader from '../components/SkeletonLoader'
 *   {isLoading && <SkeletonLoader count={6} />}
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React from 'react'
import { motion } from 'framer-motion'

// ─── Single shimmer bone ──────────────────────────────────────────────────────
const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-slate-200 rounded-lg ${className}`}>
    {/* Animated shimmer sweep */}
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
      animate={{ x: ['−100%', '200%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transform: 'translateX(-100%)' }}
    >
      {/* We use a CSS animation fallback via Tailwind's animate-shimmer class */}
    </motion.div>
  </div>
)

// ─── Single skeleton card ─────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    {/* Image placeholder */}
    <Bone className="h-52 w-full rounded-none" />

    {/* Body */}
    <div className="p-4 space-y-3">
      {/* Title line */}
      <Bone className="h-4 w-3/4" />
      {/* Subtitle */}
      <Bone className="h-3 w-1/2" />

      {/* Rating row */}
      <div className="flex items-center gap-2">
        <Bone className="h-3 w-16" />
        <Bone className="h-3 w-10" />
      </div>

      {/* Price */}
      <Bone className="h-5 w-24" />
    </div>
  </div>
)

// ─── Grid of skeleton cards ───────────────────────────────────────────────────
interface SkeletonLoaderProps {
  /** How many skeleton cards to render — defaults to 6 */
  count?: number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export default SkeletonLoader
