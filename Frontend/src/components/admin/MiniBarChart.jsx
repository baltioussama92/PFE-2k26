import React from 'react'

export default function MiniBarChart({ items = [] }) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="admin-bars">
      {items.map((item) => (
        <div key={item.label || item.city} className="admin-bars__row">
          <p>{item.label || item.city}</p>
          <div className="admin-bars__track">
            <span
              className="admin-bars__fill"
              style={{ width: `${Math.round((item.value / max) * 100)}%` }}
            />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}
