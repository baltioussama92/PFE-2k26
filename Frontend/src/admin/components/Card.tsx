import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  rightSlot?: ReactNode
  className?: string
  children: ReactNode
}

export default function Card({ title, subtitle, rightSlot, className = '', children }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-[#CBAD8D]/40 bg-[#FFFFFF] p-5 shadow-[0_8px_24px_rgba(58,45,40,0.08)] ${className}`}
    >
      {(title || subtitle || rightSlot) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-[#3A2D28]">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-[#3A2D28]/70">{subtitle}</p>}
          </div>
          {rightSlot}
        </header>
      )}
      {children}
    </section>
  )
}
