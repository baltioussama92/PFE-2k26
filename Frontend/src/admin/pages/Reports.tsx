import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminReport } from '../services/adminApi'

type ReportAction = 'resolve' | 'ban'

export default function Reports() {
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<AdminReport[]>([])
  const [target, setTarget] = useState<AdminReport | null>(null)
  const [action, setAction] = useState<ReportAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let active = true
    adminApi.getReports()
      .then((data) => {
        if (active) setReports(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const columns = useMemo<TableColumn<AdminReport>[]>(() => [
    { key: 'reporter', header: 'Reporter', render: (row) => row.reporter },
    { key: 'reason', header: 'Reason', render: (row) => row.reason },
    { key: 'target', header: 'Target', render: (row) => `${row.targetType}: ${row.target}` },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
          row.resolved ? 'bg-[#EBE3DB] text-[#3A2D28]' : 'bg-[#CBAD8D] text-[#3A2D28]'
        }`}>
          {row.resolved ? 'Resolved' : 'Open'}
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
            disabled={row.resolved}
            onClick={() => { setTarget(row); setAction('resolve') }}
          >
            Resolve
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#3A2D28] px-2.5 py-1 text-xs font-medium text-[#FFFFFF] hover:bg-[#3A2D28]/90 disabled:opacity-50"
            disabled={row.targetType !== 'user'}
            onClick={() => { setTarget(row); setAction('ban') }}
          >
            Ban user
          </button>
        </div>
      ),
    },
  ], [])

  const onConfirm = async () => {
    if (!target || !action) return
    setActionLoading(true)

    if (action === 'resolve') {
      const updated = await adminApi.resolveReport(target.id)
      if (updated) {
        setReports((prev) => prev.map((report) => (report.id === updated.id ? updated : report)))
        showToast('Report resolved.')
      }
    }

    if (action === 'ban') {
      await adminApi.banUserFromReport(target.id)
      showToast('Target user banned.')
    }

    setActionLoading(false)
    setAction(null)
    setTarget(null)
  }

  const confirmLabel = action === 'resolve' ? 'Resolve report' : 'Ban user'

  return (
    <>
      <Card title="Reports Management" subtitle="Handle abuse and moderation reports">
        <Table
          columns={columns}
          rows={reports}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No reports found."
        />
      </Card>

      <Modal
        open={Boolean(target && action)}
        title={action === 'resolve' ? 'Resolve report' : 'Ban reported user'}
        message={action === 'resolve'
          ? `Mark report #${target?.id} as resolved?`
          : `Ban ${target?.target}?`}
        confirmLabel={confirmLabel}
        onCancel={() => { setAction(null); setTarget(null) }}
        onConfirm={onConfirm}
        isLoading={actionLoading}
      />
    </>
  )
}
