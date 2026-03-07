/**
 * HomePage.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Main landing page featuring:
 *  1. Hero – bold headline + animated search bar
 *  2. Category pills – quick-filter by property type
 *  3. Featured Properties – staggered Framer Motion grid or skeleton loaders
 *  4. Stats trust-bar – social proof numbers
 *  5. About / How It Works
 *  6. CTA – Become a Host
 *
 * API connection points are marked with: // TODO: API
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import {
  Building2, Home, TreePine, Waves, Castle, Tent,
  TrendingUp, Shield, Star, ArrowRight, CheckCircle2,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import PropertyCard, { PropertyCardProps } from '../components/PropertyCard'
import SkeletonLoader from '../components/SkeletonLoader'
import Footer from '../components/Footer'
import { propertyService } from '../services/propertyService'
import type { PropertyResponse } from '../types/contracts'

// ─── Types ────────────────────────────────────────────────────────────────────
// Mirrors PropertyResponse from your backend DTOs + UI extras
interface FeaturedProperty extends Omit<PropertyCardProps, 'id'> {
  id: string | number
  reviewCount: number
  instantBooking: boolean
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&q=80',
  'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=600&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80',
]

const inferType = (title: string): string => {
  const text = title.toLowerCase()
  if (text.includes('villa')) return 'Villa'
  if (text.includes('cabin')) return 'Cabin'
  if (text.includes('camp')) return 'Camping'
  if (text.includes('beach')) return 'Beach House'
  return 'Apartment'
}

const mapToFeaturedProperty = (property: PropertyResponse, index: number): FeaturedProperty => ({
  id: property.id,
  title: property.title,
  location: property.location,
  price: Number(property.price ?? 0),
  rating: 4.6,
  reviewCount: 0,
  image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  type: inferType(property.title),
  instantBooking: true,
})

// ─── Static data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { type: 'All',        icon: <Home      size={18} />, query: '' },
  { type: 'Apartment',  icon: <Building2 size={18} />, query: 'Apartment' },
  { type: 'Villa',      icon: <Castle    size={18} />, query: 'Villa' },
  { type: 'Cabin',      icon: <TreePine  size={18} />, query: 'Cabin' },
  { type: 'Beach House',icon: <Waves     size={18} />, query: 'Beach+House' },
  { type: 'Camping',    icon: <Tent      size={18} />, query: 'Camping' },
]

const STATS = [
  { value: '12,400+', label: 'Properties Listed',    icon: <Building2 size={22} className="text-brand-500" /> },
  { value: '98%',     label: 'Guest Satisfaction',   icon: <Star      size={22} className="text-amber-400" /> },
  { value: '180+',    label: 'Cities Covered',        icon: <TrendingUp size={22} className="text-emerald-500" /> },
  { value: '256-bit', label: 'Secure Payments',       icon: <Shield    size={22} className="text-brand-500" /> },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Search Your Destination',
    desc: 'Enter your location, dates, and guest count to discover thousands of curated properties near you.',
    icon: '🔍',
  },
  {
    step: '02',
    title: 'Book Instantly',
    desc: 'Choose your favourite listing and confirm your booking in seconds — no lengthy approval wait.',
    icon: '⚡',
  },
  {
    step: '03',
    title: 'Check In & Enjoy',
    desc: 'Receive instant confirmation and access details. Arrive and feel at home from the first moment.',
    icon: '🏡',
  },
]

// ─── Framer Motion variants ────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/** Stagger parent: children animate in sequence */
const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } as never,
}

const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
}

// ─── Component ────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [properties,     setProperties]     = useState<FeaturedProperty[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')

  useEffect(() => {
    let active = true

    const loadProperties = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await propertyService.list()
        if (!active) {
          return
        }

        const featured = data.slice(0, 6).map(mapToFeaturedProperty)
        setProperties(featured)
      } catch {
        if (!active) {
          return
        }
        setError('Server Connection Error')
        setProperties([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProperties()
    return () => {
      active = false
    }
  }, [])

  // Filter by category (client-side; replace with server-side when connected)
  const filtered = activeCategory === 'All'
    ? properties
    : properties.filter(p => p.type === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

        {/* Background image with parallax-like overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')" }}
        />
        {/* Multi-stop gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-brand-900/60 to-slate-900/70" />

        {/* Animated floating blobs for depth */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 right-0 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8 pt-20">

          {/* Trust badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium rounded-full"
          >
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Trusted by 50,000+ travelers in Africa
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-4xl"
          >
            Find Your{' '}
            <span className="bg-gradient-to-r from-brand-300 via-accent-400 to-brand-400 bg-clip-text text-transparent">
              Perfect
            </span>
            {' '}Stay
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/80 max-w-xl"
          >
            Discover unique homes, villas, and apartments tailored exactly to your travel style.
          </motion.p>

          {/* Search bar — main CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full flex justify-center"
          >
            {/* SearchBar handles its own navigation to /search */}
            <SearchBar />
          </motion.div>

          {/* Quick-stats below hero */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-white/70 text-sm"
          >
            {['No hidden fees', 'Instant confirmation', 'Free cancellation'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. CATEGORY FILTER PILLS
      ════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.type}
                onClick={() => setActiveCategory(cat.type)}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  activeCategory === cat.type
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600',
                ].join(' ')}
              >
                {cat.icon}
                {cat.type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. FEATURED PROPERTIES
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
                Handpicked for you
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/search"
              className="hidden sm:flex items-center gap-1.5 text-brand-500 hover:text-brand-600 font-semibold text-sm transition-colors group"
            >
              View all
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Grid — skeleton while loading, staggered cards when ready */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : error ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center py-20 text-slate-500"
            >
              <Building2 size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">{error}</p>
              <p className="text-sm text-slate-400 mt-2">Please ensure the backend server is running on port 8080.</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center py-20 text-slate-400"
            >
              <Building2 size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No properties in this category yet.</p>
              <Link to="/search" className="mt-4 inline-block text-brand-500 hover:underline font-semibold">
                Browse all listings →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map(property => (
                <motion.div key={property.id} variants={staggerItem}>
                  {/*
                    TODO: API — `property` fields map to your PropertyResponse DTO.
                    When you fetch from the backend, just pass the response object
                    directly (after shaping it to PropertyCardProps).
                  */}
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    rating={property.rating}
                    reviewCount={property.reviewCount}
                    image={property.image}
                    type={property.type}
                    instantBooking={property.instantBooking}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Mobile "View all" link */}
          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. TRUST STATS BAR
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map(stat => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 rounded-2xl mb-3">
                  {stat.icon}
                </div>
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-brand-200 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">Simple & Easy</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How Maskan Works</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line desktop */}
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 z-0" />

            {HOW_IT_WORKS.map((step) => (
              <motion.div
                key={step.step}
                variants={staggerItem}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Step bubble */}
                <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center text-3xl mb-5 ring-4 ring-white">
                  {step.icon}
                </div>
                {/* Step number */}
                <span className="text-xs font-bold text-brand-400 tracking-widest uppercase mb-2">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. CTA — BECOME A HOST
      ════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-brand-900 p-10 md:p-16 text-center"
          >
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-5xl mb-4 block">🏠</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Have a Space to Share?
              </h2>
              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
                Join thousands of hosts earning extra income on Maskan. List your property in minutes and reach travelers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/add-property"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  List Your Property <ArrowRight size={18} />
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all duration-200"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage


