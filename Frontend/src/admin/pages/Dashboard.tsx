import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, CheckCheck, CircleDollarSign, Clock3, Headset, ShieldAlert, TrendingUp, UserRound } from 'lucide-react'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type ActivityRow, type DashboardStats } from '../services/adminApi'
import { MetricCard, MiniBarChart, MiniLineChart, SectionTabs, SurfaceCard } from '../components/ui'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const revenueTrend = [34, 39, 44, 41, 48, 53, 57, 61, 67, 72, 69, 78]
const bookingTrend = [18, 16, 20, 24, 22, 27, 31, 29, 36, 38, 34, 43]
const growthTrend = [9, 12, 16, 19, 24, 31, 35, 38, 41, 46, 49, 55]

const cityRows = [
  { city: 'Marrakech', bookings: 842, growth: '+12%' },
  { city: 'Casablanca', bookings: 693, growth: '+9%' },
  { city: 'Rabat', bookings: 451, growth: '+7%' },
  { city: 'Agadir', bookings: 397, growth: '+6%' },
  { city: 'Tangier', bookings: 312, growth: '+5%' },
]

type DashboardPanel = 'overview' | 'analytics'

export default function Dashboard() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { showToast } = useAdminToast()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityRow[]>([])

  const panel = (params.get('panel') === 'analytics' ? 'analytics' : 'overview') as DashboardPanel

  useEffect(() => {
    let active = true

    Promise.all([adminApi.getDashboardStats(), adminApi.getRecentActivity()])
      .then(([nextStats, nextActivity]) => {
        if (!active) return
        setStats(nextStats)
        setActivity(nextActivity)
      })
      .catch(() => showToast('Failed to load dashboard data.', 'error'))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [showToast])

  const cards = useMemo(() => {
    const baseUsers = stats?.totalUsers || 0
    const totalHosts = Math.round(baseUsers * 0.38)
    const totalGuests = Math.round(baseUsers * 0.62)

    return [
      { label: 'Total Users', value: loading ? '-' : baseUsers.toLocaleString(), icon: <UserRound size={18} />, tone: 'info' as const, delta: '+5.2% this month' },
      { label: 'Total Hosts', value: loading ? '-' : totalHosts.toLocaleString(), icon: <TrendingUp size={18} />, tone: 'neutral' as const, delta: '+2.4% active hosts' },
      { label: 'Total Guests', value: loading ? '-' : totalGuests.toLocaleString(), icon: <UserRound size={18} />, tone: 'neutral' as const, delta: '+6.8% returning guests' },
      { label: 'Pending Verifications', value: loading ? '-' : '27', icon: <Clock3 size={18} />, tone: 'warning' as const, delta: '8 high-priority cases' },
      { label: 'Active Bookings', value: loading ? '-' : (stats?.totalBookings || 0).toLocaleString(), icon: <CheckCheck size={18} />, tone: 'success' as const, delta: '+14.1% vs last month' },
      { label: 'Total Revenue', value: loading ? '-' : currency.format(stats?.revenue || 0), icon: <CircleDollarSign size={18} />, tone: 'success' as const, delta: 'Commission rate 12%' },
      { label: 'Support Tickets', value: loading ? '-' : '46', icon: <Headset size={18} />, tone: 'info' as const, delta: '11 unresolved > 48h' },
      { label: 'Disputes', value: loading ? '-' : '12', icon: <ShieldAlert size={18} />, tone: 'danger' as const, delta: '3 escalated today' },
    ]
  }, [loading, stats])

  const activityColumns: TableColumn<ActivityRow>[] = [
    { key: 'action', header: 'Action', render: (row) => row.action },
    { key: 'actor', header: 'Actor', render: (row) => row.actor },
    { key: 'when', header: 'When', render: (row) => row.when },
    {
      key: 'manage',
      header: 'Manage',
      className: 'whitespace-nowrap',
      render: () => (
        <button
          type="button"
          className="rounded-lg border border-[#D8C7B2] bg-[#F9F2E8] px-2.5 py-1 text-xs font-semibold text-[#4A3A2E] transition hover:bg-[#EFE1D2]"
        >
          Open
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#2F241D]">Operations Dashboard</h2>
          <p className="text-sm text-[#6F5C4D]">Premium control center for rentals, moderation, finance, and platform quality.</p>
        </div>

        <SectionTabs
          options={[
            { key: 'overview', label: 'Overview' },
            { key: 'analytics', label: 'Analytics' },
          ]}
          value={panel}
          onChange={(next) => navigate(`/admin/dashboard${next === 'analytics' ? '?panel=analytics' : ''}`)}
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            delta={card.delta}
            tone={card.tone}
            icon={card.icon}
          />
        ))}
      </section>

      {panel === 'overview' ? (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            <SurfaceCard title="Revenue Trend" subtitle="Monthly gross revenue (kUSD)" className="xl:col-span-2">
              <MiniLineChart points={revenueTrend} />
            </SurfaceCard>

            <SurfaceCard title="Most Booked Cities" subtitle="Top destinations by booking volume">
              <MiniBarChart
                data={cityRows.map((item) => item.bookings)}
                labels={cityRows.map((item) => item.city)}
              />
            </SurfaceCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <SurfaceCard title="Recent Activity" subtitle="Moderation and operations feed" className="xl:col-span-2">
              <Table
                columns={activityColumns}
                rows={activity}
                rowKey={(row) => row.id}
                loading={loading}
                emptyText="No recent activity available."
              />
            </SurfaceCard>

            <SurfaceCard title="Quick Actions" subtitle="High-impact operations shortcuts">
              <div className="space-y-2.5">
                <QuickAction label="Approve Verification" tone="success" onClick={() => navigate('/admin/guest-verifications')} />
                <QuickAction label="Review Reports" tone="danger" onClick={() => navigate('/admin/reports')} />
                <QuickAction label="Manage Listings" tone="neutral" onClick={() => navigate('/admin/listings')} />
                <QuickAction label="Send Notification" tone="info" onClick={() => navigate('/admin/settings?panel=notifications')} />
              </div>

              <div className="mt-4 rounded-2xl border border-[#ECD9C1] bg-[#FFF8EE] p-3 text-sm text-[#715D4C]">
                <div className="flex items-center gap-2 font-semibold text-[#4E3D30]">
                  <AlertTriangle size={15} />
                  Priority Watch
                </div>
                <p className="mt-1">3 disputes and 11 support tickets need action in the next 24 hours.</p>
              </div>
            </SurfaceCard>
          </section>
        </>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard title="Booking Trends" subtitle="Bookings per month">
            <MiniLineChart points={bookingTrend} />
          </SurfaceCard>

          <SurfaceCard title="User Growth" subtitle="New users per month">
            <MiniLineChart points={growthTrend} />
          </SurfaceCard>

          <SurfaceCard title="Most Booked Cities" subtitle="Demand concentration by city" className="lg:col-span-2">
            <MiniBarChart
              data={cityRows.map((item) => item.bookings)}
              labels={cityRows.map((item) => `${item.city} ${item.growth}`)}
            />
          </SurfaceCard>
        </section>
      )}
    </div>
  )
}

function QuickAction({
  label,
  onClick,
  tone,
}: {
  label: string
  onClick: () => void
  tone: 'neutral' | 'success' | 'danger' | 'info'
}) {
  const toneClass = {
    neutral: 'border-[#D6C4AE] bg-[#F8F2E8] text-[#4C3B2D] hover:bg-[#EEE2D4]',
    success: 'border-[#BBD9C5] bg-[#EBF7F0] text-[#2C6643] hover:bg-[#DDF1E5]',
    danger: 'border-[#E7BCB7] bg-[#FCEDEC] text-[#8A2F2A] hover:bg-[#F6DDDB]',
    info: 'border-[#BED2E8] bg-[#ECF3FA] text-[#234B74] hover:bg-[#DEEBF7]',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${toneClass[tone]}`}
    >
      {label}
    </button>
  )
}
