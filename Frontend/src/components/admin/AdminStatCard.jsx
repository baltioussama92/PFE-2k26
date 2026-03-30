import React from 'react'

export default function AdminStatCard({ label, value, trend, positive }) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-card__top">
        <p className="admin-stat-card__label">{label}</p>
        <span className={`admin-stat-card__trend ${positive ? 'is-positive' : 'is-negative'}`}>
          {trend}
        </span>
      </div>
      <p className="admin-stat-card__value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </article>
  )
}
