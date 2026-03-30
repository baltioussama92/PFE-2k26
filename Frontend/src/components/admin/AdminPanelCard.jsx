import React from 'react'

export default function AdminPanelCard({ title, subtitle, rightSlot, children }) {
  return (
    <section className="admin-panel-card">
      {(title || subtitle || rightSlot) && (
        <div className="admin-panel-card__head">
          <div>
            {title && <h3 className="admin-panel-card__title">{title}</h3>}
            {subtitle && <p className="admin-panel-card__subtitle">{subtitle}</p>}
          </div>
          {rightSlot}
        </div>
      )}
      {children}
    </section>
  )
}
