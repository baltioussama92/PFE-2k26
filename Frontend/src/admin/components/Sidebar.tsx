import { NavLink } from 'react-router-dom'
import { BarChart3, BookOpen, CreditCard, FileWarning, Home, Settings, Users } from 'lucide-react'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/listings', label: 'Listings', icon: BookOpen },
  { to: '/admin/bookings', label: 'Bookings', icon: BarChart3 },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', icon: FileWarning },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-[#CBAD8D]/35 bg-[#FFFFFF] p-4">
      <div className="mb-6 rounded-2xl bg-[#EBE3DB] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/70">Admin Panel</p>
        <p className="mt-1 text-lg font-bold text-[#3A2D28]">Maskan</p>
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#3A2D28] text-[#FFFFFF]'
                  : 'text-[#3A2D28] hover:bg-[#EBE3DB]'
              }`
            )}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
