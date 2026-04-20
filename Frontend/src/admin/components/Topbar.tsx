import { useMemo, useState } from 'react'
import { Bell, ChevronDown, Compass, Home, LogOut, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cx } from './ui'

interface TopbarProps {
  title: string
  onToggleSidebar: () => void
  onNavigateHome: () => void
  onNavigateExplore: () => void
  onLogout: () => void
}

const labelBySegment: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  users: 'User Management',
  listings: 'Property Management',
  bookings: 'Booking Management',
  'guest-verifications': 'Verification Center',
  reports: 'Reports & Disputes',
  payments: 'Revenue & Payments',
  settings: 'Settings',
  'host-demands': 'Host Demands',
}

export default function Topbar({
  title,
  onToggleSidebar,
  onNavigateHome,
  onNavigateExplore,
  onLogout,
}: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [query, setQuery] = useState('')

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const crumbs = segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        label: labelBySegment[segment] || segment,
        path,
      }
    })

    return crumbs
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-20 border-b border-[#DCCCB8]/65 bg-[#FCF8F2]/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 md:items-center">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-[#DCCCB8] bg-white p-2 text-[#4B3A2E] transition hover:bg-[#F5EADF] lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7B675A]">Admin workspace</p>
            <h1 className="truncate text-2xl font-black tracking-tight text-[#2F241F]">{title}</h1>
            <div className="mt-1 flex items-center gap-1.5 overflow-x-auto text-xs text-[#6D594D]">
              {breadcrumbs.map((crumb, index) => (
                <button
                  key={crumb.path}
                  type="button"
                  onClick={() => navigate(crumb.path)}
                  className={cx('whitespace-nowrap hover:text-[#2F241F]', index === breadcrumbs.length - 1 && 'font-semibold text-[#3A2D28]')}
                >
                  {index > 0 ? ' / ' : ''}
                  {crumb.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="group relative min-w-[220px] flex-1 md:max-w-md">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7662]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users, listings, disputes, tickets..."
              className="w-full rounded-xl border border-[#DCCCB8] bg-white py-2 pl-9 pr-3 text-sm text-[#3A2D28] outline-none transition placeholder:text-[#96816D] focus:border-[#B99168] focus:ring-2 focus:ring-[#E8D7C4]"
            />
          </label>

          <button
            type="button"
            className="relative inline-flex items-center rounded-xl border border-[#DCCCB8] bg-white px-3 py-2 text-sm font-semibold text-[#3A2D28] transition hover:bg-[#F7EEE3]"
          >
            <Bell size={16} />
            <span className="absolute -right-1.5 -top-1.5 h-4 min-w-4 rounded-full bg-[#A85B32] px-1 text-[10px] leading-4 text-white">4</span>
          </button>

          <span className="hidden rounded-full bg-[#EADCCD] px-3 py-1 text-xs font-semibold text-[#3A2D28] sm:inline-flex">
            Role: super admin
          </span>

          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBAD8D]/60 bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#3A2D28] transition hover:bg-[#F5EBDF]"
          >
            <Home size={14} />
            Home
          </button>
          <button
            type="button"
            onClick={onNavigateExplore}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBAD8D]/60 bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#3A2D28] transition hover:bg-[#F5EBDF]"
          >
            <Compass size={14} />
            Explore
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DCCCB8] bg-white px-3 py-2 text-sm font-semibold text-[#3A2D28] transition hover:bg-[#F5EBDF]"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3A2D28] text-xs font-bold text-[#FDF7EF]">AD</span>
              <span className="hidden sm:inline">Admin</span>
              <ChevronDown size={14} />
            </button>

            {showProfileMenu ? (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#DCCCB8] bg-white p-2 shadow-[0_16px_30px_rgba(58,45,40,0.16)]">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    navigate('/admin/settings')
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-[#3A2D28] hover:bg-[#F5EBDF]"
                >
                  Profile settings
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#7D2B24] hover:bg-[#FBEDEB]"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
