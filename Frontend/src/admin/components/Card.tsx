import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  title?: string
  subtitle?: string
  rightSlot?: ReactNode
  className?: string
  children: ReactNode
}

export default function Card({ title, subtitle, rightSlot, className = '', children }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`rounded-3xl border border-[#D6BEA5]/50 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFCF8_100%)] p-5 shadow-[0_12px_30px_rgba(58,45,40,0.09)] ${className}`}
    >
      {(title || subtitle || rightSlot) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-black tracking-tight text-[#2F241F]">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-[#6D594D]">{subtitle}</p>}
          </div>
          {rightSlot}
        </header>
      )}
      {children}
    </motion.section>
  )
}
