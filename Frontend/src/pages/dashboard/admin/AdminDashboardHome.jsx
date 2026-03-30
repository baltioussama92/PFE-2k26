import React from 'react'
import { adminStats, bookingsSeries, bookingMonths, recentActivities } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminStatCard from '../../../components/admin/AdminStatCard'
import MiniLineChart from '../../../components/admin/MiniLineChart'

export default function AdminDashboardHome() {
  return (
    <div className="admin-grid-gap">
      <section className="admin-stats-grid">
        {adminStats.map((item) => (
          <AdminStatCard
            key={item.key}
            label={item.label}
            value={item.value}
            trend={item.trend}
            positive={item.positive}
          />
        ))}
      </section>

      <section className="admin-two-columns">
        <AdminPanelCard title="Bookings Overview" subtitle="Monthly completed bookings">
          <MiniLineChart values={bookingsSeries} labels={bookingMonths} />
        </AdminPanelCard>

        <AdminPanelCard title="Recent Activity" subtitle="Latest platform actions">
          <ul className="admin-activity-list">
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <div>
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>
                <span>{activity.time}</span>
              </li>
            ))}
          </ul>
        </AdminPanelCard>
      </section>
    </div>
  )
}
