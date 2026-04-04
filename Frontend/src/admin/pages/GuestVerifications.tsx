import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Table, { type TableColumn } from '../components/Table'
import Modal from '../components/Modal'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminUser } from '../services/adminApi'

function toAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.replace(/\\/g, '/')
  if (normalized.startsWith('/')) return `http://localhost:8080${normalized}`
  return `http://localhost:8080/${normalized}`
}

function fileNameFromPath(path: string): string {
  if (!path) return 'file'
  const normalized = path.replace(/\\/g, '/')
  const parts = normalized.split('/')
  return parts[parts.length - 1] || 'file'
}

export default function GuestVerificationsPage() {
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<AdminUser[]>([])
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [reason, setReason] = useState('')

  useEffect(() => {
    let active = true

    adminApi.getGuestVerificationRequests()
      .then((data) => {
        if (active) setRequests(data)
      })
      .catch(() => {
        showToast('Failed to load guest verification requests.', 'error')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [showToast])

  const columns = useMemo<TableColumn<AdminUser>[]>(() => [
    {
      key: 'name',
      header: 'Guest',
      render: (row) => row.name,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => row.email,
    },
    {
      key: 'identitySubmittedAt',
      header: 'Submitted',
      render: (row) => row.identitySubmittedAt ? new Date(row.identitySubmittedAt).toLocaleString() : 'Unknown',
    },
    {
      key: 'attachments',
      header: 'Attachments',
      render: (row) => {
        const count = (row.governmentIdFiles?.length || 0) + (row.otherAttachmentFiles?.length || 0) + (row.selfieFile ? 1 : 0)
        return <span>{count}</span>
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#CBAD8D]/70 px-2.5 py-1 text-xs font-semibold text-[#3A2D28] hover:bg-[#EBE3DB]"
            onClick={() => {
              setSelected(row)
              setAction(null)
            }}
          >
            Review
          </button>
          <button
            type="button"
            className="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700"
            onClick={() => {
              setSelected(row)
              setAction('approve')
            }}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
            onClick={() => {
              setSelected(row)
              setAction('reject')
            }}
          >
            Reject
          </button>
        </div>
      ),
    },
  ], [])

  const closeModal = () => {
    setSelected(null)
    setAction(null)
    setReason('')
  }

  const onConfirmAction = async () => {
    if (!selected || !action) return
    setActionLoading(true)

    try {
      const targetId = selected.backendId || selected.id
      const updated = action === 'approve'
        ? await adminApi.approveGuestVerification(targetId)
        : await adminApi.rejectGuestVerification(targetId, reason)

      setRequests((prev) => prev.filter((user) => user.id !== updated.id))
      showToast(`Guest verification ${action === 'approve' ? 'approved' : 'rejected'} successfully.`)
      closeModal()
    } catch {
      showToast(`Failed to ${action} guest verification.`, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const governmentIds = selected?.governmentIdFiles || []
  const otherAttachments = selected?.otherAttachmentFiles || []

  return (
    <>
      <Card title="Guest Verification Requests" subtitle="Review submitted IDs and approve guests for booking access">
        <Table
          columns={columns}
          rows={requests}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No pending guest verification requests."
        />
      </Card>

      <Modal
        open={Boolean(selected) && Boolean(action)}
        title={action === 'approve' ? 'Approve guest verification' : 'Reject guest verification'}
        message={
          action === 'approve'
            ? `Confirm approval for ${selected?.name}?`
            : `Confirm rejection for ${selected?.name}?`
        }
        confirmLabel={action === 'approve' ? 'Approve' : 'Reject'}
        isLoading={actionLoading}
        onCancel={closeModal}
        onConfirm={onConfirmAction}
        footerSlot={action === 'reject' ? (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-[#3A2D28]" htmlFor="reject-reason">
              Rejection reason
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Explain why verification is rejected"
              className="w-full rounded-lg border border-[#CBAD8D]/60 px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]"
            />
          </div>
        ) : undefined}
      />

      <Modal
        open={Boolean(selected) && !action}
        title={selected ? `Verification Review: ${selected.name}` : 'Verification Review'}
        message={selected ? `${selected.email}` : ''}
        confirmLabel="Close"
        onCancel={closeModal}
        onConfirm={closeModal}
        footerSlot={selected ? (
          <div className="mt-3 space-y-4 text-[#3A2D28]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7C6654]">Government ID files</p>
              {governmentIds.length === 0 ? (
                <p className="mt-1 text-sm">No ID files uploaded.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {governmentIds.map((filePath, index) => (
                    <li key={`${filePath}-${index}`}>
                      <a className="text-sm text-[#6D533C] underline" href={toAssetUrl(filePath)} target="_blank" rel="noreferrer">
                        {fileNameFromPath(filePath)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7C6654]">Selfie</p>
              {selected.selfieFile ? (
                <a className="text-sm text-[#6D533C] underline" href={toAssetUrl(selected.selfieFile)} target="_blank" rel="noreferrer">
                  {fileNameFromPath(selected.selfieFile)}
                </a>
              ) : (
                <p className="mt-1 text-sm">No selfie uploaded.</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7C6654]">Other attachments</p>
              {otherAttachments.length === 0 ? (
                <p className="mt-1 text-sm">No additional attachments.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {otherAttachments.map((filePath, index) => (
                    <li key={`${filePath}-${index}`}>
                      <a className="text-sm text-[#6D533C] underline" href={toAssetUrl(filePath)} target="_blank" rel="noreferrer">
                        {fileNameFromPath(filePath)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : undefined}
      />
    </>
  )
}
