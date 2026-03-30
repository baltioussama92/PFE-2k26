import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminListing } from '../services/adminApi'

type ListingAction = 'approve' | 'reject' | 'delete'

export default function Listings() {
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<AdminListing[]>([])
  const [target, setTarget] = useState<AdminListing | null>(null)
  const [action, setAction] = useState<ListingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let active = true
    adminApi.getListings()
      .then((data) => {
        if (active) setListings(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const columns = useMemo<TableColumn<AdminListing>[]>(() => [
    { key: 'title', header: 'Title', render: (row) => row.title },
    { key: 'host', header: 'Host', render: (row) => row.host },
    { key: 'location', header: 'Location', render: (row) => row.location },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === 'approved' ? 'bg-[#EBE3DB] text-[#3A2D28]' : 'bg-[#CBAD8D] text-[#3A2D28]'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#CBAD8D]/70 px-2.5 py-1 text-xs font-medium text-[#3A2D28] hover:bg-[#EBE3DB] disabled:opacity-50"
            disabled={row.status === 'approved'}
            onClick={() => { setTarget(row); setAction('approve') }}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded-lg border border-[#CBAD8D]/70 px-2.5 py-1 text-xs font-medium text-[#3A2D28] hover:bg-[#EBE3DB]"
            onClick={() => { setTarget(row); setAction('reject') }}
          >
            Reject
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#3A2D28] px-2.5 py-1 text-xs font-medium text-[#FFFFFF] hover:bg-[#3A2D28]/90"
            onClick={() => { setTarget(row); setAction('delete') }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ], [])

  const onConfirmAction = async () => {
    if (!target || !action) return
    setActionLoading(true)

    if (action === 'approve') {
      const updated = await adminApi.approveListing(target.id)
      if (updated) {
        setListings((prev) => prev.map((listing) => (listing.id === updated.id ? updated : listing)))
        showToast('Listing approved successfully.')
      }
    }

    if (action === 'reject') {
      await adminApi.rejectListing(target.id)
      setListings((prev) => prev.filter((listing) => listing.id !== target.id))
      showToast('Listing rejected.')
    }

    if (action === 'delete') {
      await adminApi.deleteListing(target.id)
      setListings((prev) => prev.filter((listing) => listing.id !== target.id))
      showToast('Listing deleted.')
    }

    setActionLoading(false)
    setTarget(null)
    setAction(null)
  }

  const actionTitle = action ? `${action[0].toUpperCase()}${action.slice(1)} listing` : 'Confirm action'

  return (
    <>
      <Card title="Listings Management" subtitle="Approve, reject, or remove property listings">
        <Table
          columns={columns}
          rows={listings}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No listings found."
        />
      </Card>

      <Modal
        open={Boolean(target && action)}
        title={actionTitle}
        message={`Are you sure you want to ${action} \"${target?.title}\"?`}
        confirmLabel={actionTitle}
        onCancel={() => { setTarget(null); setAction(null) }}
        onConfirm={onConfirmAction}
        isLoading={actionLoading}
      />
    </>
  )
}
