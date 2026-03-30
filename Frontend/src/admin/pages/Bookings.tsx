import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminBooking } from '../services/adminApi'

export default function Bookings() {
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [target, setTarget] = useState<AdminBooking | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let active = true
    adminApi.getBookings()
      .then((data) => {
        if (active) setBookings(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const columns = useMemo<TableColumn<AdminBooking>[]>(() => [
    { key: 'guest', header: 'Guest', render: (row) => row.guest },
    { key: 'property', header: 'Property', render: (row) => row.property },
    { key: 'dates', header: 'Dates', render: (row) => row.dates },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="capitalize text-[#3A2D28]/85">{row.status}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          type="button"
          className="rounded-lg bg-[#3A2D28] px-2.5 py-1 text-xs font-medium text-[#FFFFFF] hover:bg-[#3A2D28]/90 disabled:opacity-50"
          disabled={row.status === 'cancelled'}
          onClick={() => setTarget(row)}
        >
          Cancel booking
        </button>
      ),
    },
  ], [])

  const onCancelBooking = async () => {
    if (!target) return
    setActionLoading(true)
    const updated = await adminApi.cancelBooking(target.id)
    setActionLoading(false)

    if (!updated) {
      showToast('Failed to cancel booking.', 'error')
      return
    }

    setBookings((prev) => prev.map((booking) => (booking.id === updated.id ? updated : booking)))
    setTarget(null)
    showToast('Booking cancelled.')
  }

  return (
    <>
      <Card title="Bookings Management" subtitle="Monitor and cancel problematic bookings">
        <Table
          columns={columns}
          rows={bookings}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No bookings found."
        />
      </Card>

      <Modal
        open={Boolean(target)}
        title="Cancel booking"
        message={`Cancel booking for ${target?.guest} at ${target?.property}?`}
        confirmLabel="Cancel booking"
        onCancel={() => setTarget(null)}
        onConfirm={onCancelBooking}
        isLoading={actionLoading}
      />
    </>
  )
}
