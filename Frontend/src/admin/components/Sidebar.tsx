import { NavLink } from 'react-router-dom'
import { BarChart3, BookOpen, Compass, CreditCard, FileWarning, Home, LogOut, Settings, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/listings', label: 'Listings', icon: BookOpen },
  { to: '/admin/bookings', label: 'Bookings', icon: BarChart3 },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', icon: FileWarning },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  onNavigateHome: () => void
  onNavigateExplore: () => void
  onLogout: () => void
}

export default function Sidebar({ onNavigateHome, onNavigateExplore, onLogout }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[#CBAD8D]/35 bg-gradient-to-b from-[#2F241F] to-[#3A2D28] p-4 text-[#F9F4ED] lg:flex lg:flex-col">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mb-6 rounded-2xl border border-[#CBAD8D]/20 bg-[#FFFFFF]/10 px-4 py-4 backdrop-blur"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F2E5D7]/75">Admin workspace</p>
        <p className="mt-1 text-2xl font-black tracking-tight">MASKAN</p>
        <p className="mt-1 text-xs text-[#F2E5D7]/70">Control, moderation and insights</p>
      </motion.div>

      <nav className="space-y-1.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#CBAD8D]/25 text-[#FFFFFF] ring-1 ring-[#CBAD8D]/45'
                  : 'text-[#F2E5D7]/90 hover:bg-[#FFFFFF]/10 hover:text-[#FFFFFF]'
              }`
            )}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 space-y-2 rounded-2xl border border-[#CBAD8D]/20 bg-[#FFFFFF]/10 p-3">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#F9F4ED] transition hover:bg-[#FFFFFF]/12"
        >
          <Home size={15} />
          Home page
        </button>
        <button
          type="button"
          onClick={onNavigateExplore}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#F9F4ED] transition hover:bg-[#FFFFFF]/12"
        >
          <Compass size={15} />
          Explore listings
        </button>
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CBAD8D] px-3 py-2.5 text-sm font-semibold text-[#2F241F] transition hover:bg-[#D8B999]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
