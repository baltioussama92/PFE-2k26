import React from 'react'

export default function MiniLineChart({ values = [], labels = [] }) {
  const width = 900
  const height = 220
  const padding = 26
  const max = Math.max(...values, 1)
  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2)
    const y = height - padding - (value / max) * (height - padding * 2)
    return [x, y]
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0].toFixed(2)},${point[1].toFixed(2)}`)
    .join(' ')

  const areaPath = `${linePath} L${points[points.length - 1]?.[0] ?? 0},${height - padding} L${points[0]?.[0] ?? 0},${height - padding} Z`

  return (
    <div className="admin-chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} className="admin-chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="adminAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#adminAreaGradient)" />
        <path d={linePath} fill="none" stroke="var(--admin-accent)" strokeWidth="4" strokeLinecap="round" />
        {points.map((point, index) => (
          <circle key={labels[index] || index} cx={point[0]} cy={point[1]} r="4" fill="var(--admin-accent-strong)" />
        ))}
      </svg>
      <div className="admin-chart-labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
