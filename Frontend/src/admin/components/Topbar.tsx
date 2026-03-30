interface TopbarProps {
  title: string
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#CBAD8D]/35 bg-[#FFFFFF] px-6">
      <div>
        <h1 className="text-xl font-semibold text-[#3A2D28]">{title}</h1>
        <p className="text-xs text-[#3A2D28]/70">House renting administration workspace</p>
      </div>
      <span className="rounded-full bg-[#EBE3DB] px-3 py-1 text-xs font-semibold text-[#3A2D28]">
        Role: admin
      </span>
    </header>
  )
}
