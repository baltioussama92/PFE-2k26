import React from 'react'

export default function StatusBadge({ value }) {
  const key = String(value || '').toLowerCase()

  const className =
    key === 'active' || key === 'approved' || key === 'accepted' || key === 'completed' || key === 'resolved'
      ? 'admin-badge is-success'
      : key === 'suspended' || key === 'rejected' || key === 'open'
      ? 'admin-badge is-danger'
      : key === 'pending' || key === 'under review'
      ? 'admin-badge is-warning'
      : 'admin-badge'

  return <span className={className}>{value}</span>
}
