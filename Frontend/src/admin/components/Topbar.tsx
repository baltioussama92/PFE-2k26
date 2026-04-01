import { Compass, Home, LogOut } from 'lucide-react'

interface TopbarProps {
  title: string
  onNavigateHome: () => void
  onNavigateExplore: () => void
  onLogout: () => void
}

export default function Topbar({ title, onNavigateHome, onNavigateExplore, onLogout }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#CBAD8D]/30 bg-[#FDF8F2]/85 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7B675A]">Admin workspace</p>
          <h1 className="text-2xl font-black tracking-tight text-[#2F241F]">{title}</h1>
          <p className="text-xs text-[#6D594D]">House renting administration with moderation controls</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EADCCD] px-3 py-1 text-xs font-semibold text-[#3A2D28]">
            Role: admin
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
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#3A2D28] px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] transition hover:bg-[#2B211D] lg:hidden"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
