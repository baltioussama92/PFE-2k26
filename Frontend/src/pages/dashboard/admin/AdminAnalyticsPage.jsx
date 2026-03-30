import React from 'react'
import {
  usersGrowth,
  monthlyBookings,
  bookingMonths,
  popularCities,
  listingDistribution,
} from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import MiniLineChart from '../../../components/admin/MiniLineChart'
import MiniBarChart from '../../../components/admin/MiniBarChart'

export default function AdminAnalyticsPage() {
  const cityItems = popularCities.map((item) => ({ label: item.city, value: item.value }))

  return (
    <div className="admin-grid-gap">
      <section className="admin-two-columns">
        <AdminPanelCard title="Users Growth" subtitle="New users over time">
          <MiniLineChart values={usersGrowth} labels={bookingMonths} />
        </AdminPanelCard>

        <AdminPanelCard title="Bookings Per Month" subtitle="Reservation trends">
          <MiniLineChart values={monthlyBookings} labels={bookingMonths} />
        </AdminPanelCard>
      </section>

      <section className="admin-two-columns">
        <AdminPanelCard title="Most Popular Cities" subtitle="By active demand">
          <MiniBarChart items={cityItems} />
        </AdminPanelCard>

        <AdminPanelCard title="Listings Distribution" subtitle="Current supply mix">
          <div className="admin-bars">
            {listingDistribution.map((item) => (
              <div key={item.label} className="admin-bars__row">
                <p>{item.label}</p>
                <div className="admin-bars__track">
                  <span className="admin-bars__fill" style={{ width: `${item.percent}%` }} />
                </div>
                <strong>{item.percent}%</strong>
              </div>
            ))}
          </div>
        </AdminPanelCard>
      </section>
    </div>
  )
}
