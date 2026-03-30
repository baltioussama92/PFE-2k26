import React from 'react'
import { useLocation } from 'react-router-dom'
import './admin/admin-dashboard.css'
import AdminDashboardHome from './admin/AdminDashboardHome'
import AdminUsersPage from './admin/AdminUsersPage'
import AdminHousesPage from './admin/AdminHousesPage'
import AdminBookingsPage from './admin/AdminBookingsPage'
import AdminReportsPage from './admin/AdminReportsPage'
import AdminAnalyticsPage from './admin/AdminAnalyticsPage'
import AdminSettingsPage from './admin/AdminSettingsPage'

export default function AdminView() {
  const location = useLocation()

  const routes = {
    '/dashboard': <AdminDashboardHome />,
    '/dashboard/users': <AdminUsersPage />,
    '/dashboard/houses': <AdminHousesPage />,
    '/dashboard/bookings': <AdminBookingsPage />,
    '/dashboard/reports': <AdminReportsPage />,
    '/dashboard/analytics': <AdminAnalyticsPage />,
    '/dashboard/settings': <AdminSettingsPage />,
  }

  return <div className="admin-theme">{routes[location.pathname] || <AdminDashboardHome />}</div>
}
