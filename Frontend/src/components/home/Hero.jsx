import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Shield, TrendingUp, ChevronDown } from 'lucide-react'
import SearchBar from './SearchBar'
import { STATS } from '../../data/mockData'

// -- Floating badge helper ------------------------------------
function FloatingBadge({ className, icon: Icon, label, sub }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute rounded-2xl border border-primary-200/20 bg-primary-50/70 px-4 py-3 shadow-glass backdrop-blur-xl pointer-events-none ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-primary-600" style={{ width: '1.1rem', height: '1.1rem' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-primary-800 leading-none">{label}</p>
          <p className="text-[10px] text-primary-500 mt-0.5">{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

// -- Hero Background Slides ------------------------------------
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=90',
]

// -- Container variants ----------------------------------------
const containerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}
const itemVar = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y:  0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero({ onSearch }) {
  const [bg, setBg] = useState(0)

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* -- Background Image Carousel ------------------------ */}
      {BG_IMAGES.map((src, i) => (
        <motion.div
          key={src}
          animate={{ opacity: i === bg ? 1 : 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage:    `url(${src})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* -- Multiple gradient overlays ------------------------ */}
  <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent" />

      {/* -- Dot pattern overlay ------------------------------- */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* -- Floating ambient orbs ----------------------------- */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* -- Hero Content -------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Pill badge */}
          <motion.div variants={itemVar}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             bg-primary-50/10 backdrop-blur-sm border border-primary-200/20 text-primary-50/90
                             text-xs font-semibold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary-300 animate-pulse" />
              Plateforme #1 en Tunisie
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVar}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary-50 leading-[1.1] max-w-4xl"
          >
            Trouvez le{' '}
            <span className="relative inline-block">
              <span className="gradient-text">logement idéal</span>
              <motion.svg
                viewBox="0 0 340 12"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
              >
                <motion.path
                  d="M4 8 Q170 2 336 8"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%"   stopColor="#B8622A" />
                    <stop offset="100%" stopColor="#D4A876" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
            {' '}en Tunisie
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            variants={itemVar}
            className="max-w-xl text-lg text-primary-50/75 leading-relaxed font-light"
          >
            Appartements, villas et studios à des milliers de propriétés vérifiées,
            des hôtes de confiance, des réservations sécurisées.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVar} className="w-full flex justify-center">
            <SearchBar onSearch={onSearch} />
          </motion.div>

          {/* Popular Searches */}
          <motion.div variants={itemVar} className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-primary-50/50 text-xs font-medium mr-1">Populaire :</span>
            {['Tunis', 'Hammamet', 'La Marsa', 'Djerba', 'Sfax'].map((city) => (
              <motion.button
                key={city}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium
                           bg-primary-50/10 backdrop-blur-sm border border-primary-200/20
                           text-primary-50/80 hover:bg-primary-50/20 hover:text-primary-50
                           transition-all duration-150"
              >
                {city}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* -- Stats Row ---------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-primary-200/10 bg-primary-900/45 px-5 py-4 text-center backdrop-blur-xl">
              <p className="text-2xl font-extrabold text-primary-50 leading-none">{value}</p>
              <p className="text-xs text-primary-50/50 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* -- Floating UI Badges -------------------------------- */}
      <FloatingBadge
        className="top-[28%] left-[6%] hidden lg:flex"
        icon={Star}
        label="Note Moyenne 4.9?"
        sub="Sur 18 000+ avis"
      />
      <FloatingBadge
        className="top-[36%] right-[5%] hidden lg:flex"
        icon={Shield}
        label="Paiements sécurisés"
        sub="Cryptage SSL 256-bit"
      />
      <FloatingBadge
        className="bottom-[28%] left-[8%] hidden xl:flex"
        icon={TrendingUp}
        label="+340 nouvelles annonces"
        sub="Cette semaine"
      />

      {/* -- BG Image Dots ------------------------------------- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setBg(i)}
            className={`transition-all duration-300 rounded-full ${
              i === bg ? 'w-6 h-2 bg-primary-100' : 'w-2 h-2 bg-primary-50/40 hover:bg-primary-50/70'
            }`}
          />
        ))}
      </div>

      {/* -- Scroll indicator ---------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-1 z-10 hidden md:flex"
      >
        <span className="text-[10px] text-primary-50/40 uppercase tracking-widest font-semibold">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-4 h-4 text-primary-50/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
