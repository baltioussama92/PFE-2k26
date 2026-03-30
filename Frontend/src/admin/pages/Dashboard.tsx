import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table, { type TableColumn } from '../components/Table'
import { adminApi, type ActivityRow, type DashboardStats } from '../services/adminApi'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityRow[]>([])

  useEffect(() => {
    let active = true
    Promise.all([adminApi.getDashboardStats(), adminApi.getRecentActivity()])
      .then(([nextStats, nextActivity]) => {
        if (!active) return
        setStats(nextStats)
        setActivity(nextActivity)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const activityColumns: TableColumn<ActivityRow>[] = [
    { key: 'action', header: 'Action', render: (row) => row.action },
    { key: 'actor', header: 'Actor', render: (row) => row.actor },
    { key: 'when', header: 'When', render: (row) => row.when },
  ]

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Users">
          <p className="text-2xl font-semibold text-[#3A2D28]">{loading ? '-' : stats?.totalUsers ?? 0}</p>
        </Card>
        <Card title="Total Listings">
          <p className="text-2xl font-semibold text-[#3A2D28]">{loading ? '-' : stats?.totalListings ?? 0}</p>
        </Card>
        <Card title="Total Bookings">
          <p className="text-2xl font-semibold text-[#3A2D28]">{loading ? '-' : stats?.totalBookings ?? 0}</p>
        </Card>
        <Card title="Revenue">
          <p className="text-2xl font-semibold text-[#3A2D28]">
            {loading ? '-' : currency.format(stats?.revenue ?? 0)}
          </p>
        </Card>
      </section>

      <Card title="Recent Activity" subtitle="Latest platform moderation and operations">
        <Table
          columns={activityColumns}
          rows={activity}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No activity available."
        />
      </Card>
    </div>
  )
}
