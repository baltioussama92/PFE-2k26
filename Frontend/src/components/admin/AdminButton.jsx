import React from 'react'

export default function AdminButton({
  children,
  variant = 'solid',
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`admin-btn admin-btn--${variant} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
