import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminBooking } from '../services/adminApi'

export default function Bookings() {
  const navigate = useNavigate()
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
      .catch(() => {
        showToast('Failed to load bookings.', 'error')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const resolveGuestIdentifier = (booking: AdminBooking): string | number | null => {
    if (booking.guestId) return booking.guestId
    const guestMatch = booking.guest.match(/#(.+)$/)
    return guestMatch?.[1] || null
  }

  const columns = useMemo<TableColumn<AdminBooking>[]>(() => [
    { key: 'guest', header: 'Guest', render: (row) => row.guest },
    { key: 'bookedFrom', header: 'Booked From', render: (row) => row.host || 'Unknown host' },
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
      render: (row) => {
        const guestIdentifier = resolveGuestIdentifier(row)
        return (
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-[#CBAD8D]/70 px-2.5 py-1 text-xs font-medium text-[#3A2D28] hover:bg-[#EBE3DB] disabled:opacity-50"
              disabled={!guestIdentifier}
              onClick={() => {
                if (!guestIdentifier) {
                  showToast('No guest details are available for this booking.', 'error')
                  return
                }
                navigate(`/admin/users/${guestIdentifier}`)
              }}
            >
              View
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#3A2D28] px-2.5 py-1 text-xs font-medium text-[#FFFFFF] hover:bg-[#3A2D28]/90 disabled:opacity-50"
              disabled={row.status === 'cancelled'}
              onClick={() => setTarget(row)}
            >
              Cancel booking
            </button>
          </div>
        )
      },
    },
  ], [navigate, showToast])

  const onCancelBooking = async () => {
    if (!target) return
    setActionLoading(true)
    try {
      const updated = await adminApi.cancelBooking(target.id)

      if (!updated) {
        showToast('Failed to cancel booking.', 'error')
        return
      }

      setBookings((prev) => prev.map((booking) => (booking.id === updated.id ? updated : booking)))
      setTarget(null)
      showToast('Booking cancelled.')
    } catch {
      showToast('Failed to cancel booking.', 'error')
    } finally {
      setActionLoading(false)
    }
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
