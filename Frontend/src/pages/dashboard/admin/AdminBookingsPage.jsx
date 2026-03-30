import React, { useState } from 'react'
import { bookings as seedBookings } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminTable from '../../../components/admin/AdminTable'
import AdminButton from '../../../components/admin/AdminButton'
import StatusBadge from '../../../components/admin/StatusBadge'

const columns = ['Booking ID', 'Guest', 'Host', 'House', 'Check-in', 'Check-out', 'Status', 'Actions']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(seedBookings)

  const cancelBooking = (id) => {
    setBookings((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item)))
  }

  return (
    <AdminPanelCard title="Bookings" subtitle="Monitor all reservations">
      <AdminTable
        columns={columns}
        data={bookings}
        renderRow={(booking) => (
          <tr key={booking.id}>
            <td>{booking.id}</td>
            <td>{booking.guest}</td>
            <td>{booking.host}</td>
            <td>{booking.house}</td>
            <td>{booking.checkIn}</td>
            <td>{booking.checkOut}</td>
            <td>
              <StatusBadge value={booking.status} />
            </td>
            <td>
              <div className="admin-action-row">
                <AdminButton variant="ghost">View Booking</AdminButton>
                <AdminButton variant="danger" onClick={() => cancelBooking(booking.id)}>
                  Cancel Booking
                </AdminButton>
              </div>
            </td>
          </tr>
        )}
      />
    </AdminPanelCard>
  )
}
