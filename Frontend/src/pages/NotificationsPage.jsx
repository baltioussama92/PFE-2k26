import React from 'react'
import { useNotifications } from '../context/NotificationContext'

export default function NotificationsPage() {
  const { notifications = [] } = useNotifications() || {}

  return (
    <div className="min-h-screen px-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Notifications</h1>
        {notifications.length === 0 ? (
          <p className="text-slate-500">No notifications yet. (Placeholder)</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n, i) => (
              <li key={i} className="p-3 border rounded-lg bg-white">{n.title || n.message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
