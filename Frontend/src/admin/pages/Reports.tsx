import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminReport } from '../services/adminApi'
import { SectionTabs, StatusBadge, SurfaceCard } from '../components/ui'

type ReportsPanel = 'reports' | 'chat' | 'support'
type ReportAction = 'warn' | 'suspend' | 'ban' | 'refund' | 'close'

interface SupportTicket {
  id: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'assigned' | 'escalated' | 'resolved'
  requester: string
}

interface FlaggedConversation {
  id: string
  users: string
  message: string
  time: string
  severity: 'low' | 'medium' | 'high'
}

const supportTickets: SupportTicket[] = [
  { id: 'SUP-1042', subject: 'Double charge on booking #7743', priority: 'critical', status: 'open', requester: 'Fatima N.' },
  { id: 'SUP-1038', subject: 'Host account suspended by mistake', priority: 'high', status: 'assigned', requester: 'Ahmed L.' },
  { id: 'SUP-1029', subject: 'Unable to upload ownership proof', priority: 'medium', status: 'escalated', requester: 'Yasmine B.' },
]

const flaggedConversations: FlaggedConversation[] = [
  { id: 'CHAT-887', users: 'guest#239 <> host#54', message: 'Repeated harassment language detected', time: '2026-04-18 14:32', severity: 'high' },
  { id: 'CHAT-885', users: 'guest#451 <> host#88', message: 'Payment fraud solicitation phrase match', time: '2026-04-18 12:11', severity: 'high' },
  { id: 'CHAT-879', users: 'guest#118 <> host#93', message: 'Aggressive language warning', time: '2026-04-17 22:03', severity: 'medium' },
]

export default function Reports() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { showToast } = useAdminToast()

  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<AdminReport[]>([])
  const [target, setTarget] = useState<AdminReport | null>(null)
  const [action, setAction] = useState<ReportAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [internalNotes, setInternalNotes] = useState('')
  const [adminDecision, setAdminDecision] = useState('')

  const panel = (params.get('panel') === 'chat' ? 'chat' : params.get('panel') === 'support' ? 'support' : 'reports') as ReportsPanel

  useEffect(() => {
    let active = true

    adminApi.getReports()
      .then((data) => {
        if (active) setReports(data)
      })
      .catch(() => showToast('Failed to load reports.', 'error'))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [showToast])

  const reportColumns = useMemo<TableColumn<AdminReport>[]>(() => [
    { key: 'reporter', header: 'Reporter', render: (row) => row.reporter },
    {
      key: 'reason',
      header: 'Issue',
      render: (row) => (
        <div>
          <p className="font-semibold text-[#2E241D]">{row.reason}</p>
          <p className="text-xs text-[#756151]">Target: {row.targetType} / {row.target}</p>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <StatusBadge tone={row.targetType === 'user' ? 'danger' : 'warning'}>
          {row.targetType === 'user' ? 'High' : 'Medium'}
        </StatusBadge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge tone={row.resolved ? 'success' : 'warning'}>
          {row.resolved ? 'Closed' : 'Open'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <ActionButton label="Warn" onClick={() => openAction(row, 'warn')} />
          <ActionButton label="Suspend" onClick={() => openAction(row, 'suspend')} />
          <ActionButton label="Ban" onClick={() => openAction(row, 'ban')} tone="danger" />
          <ActionButton label="Refund" onClick={() => openAction(row, 'refund')} />
          <ActionButton label="Close" onClick={() => openAction(row, 'close')} />
        </div>
      ),
    },
  ], [])

  const flaggedColumns: TableColumn<FlaggedConversation>[] = [
    { key: 'id', header: 'Conversation', render: (row) => row.id },
    { key: 'users', header: 'Users', render: (row) => row.users },
    { key: 'message', header: 'Flagged Message', render: (row) => row.message },
    { key: 'time', header: 'Timestamp', render: (row) => row.time },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => <StatusBadge tone={row.severity === 'high' ? 'danger' : row.severity === 'medium' ? 'warning' : 'neutral'}>{row.severity}</StatusBadge>,
    },
    {
      key: 'moderate',
      header: 'Moderate',
      render: () => (
        <div className="flex gap-1.5">
          <ActionButton label="Mute" onClick={() => showToast('User muted (demo).')} />
          <ActionButton label="Warn" onClick={() => showToast('Warning sent (demo).')} />
          <ActionButton label="Suspend" onClick={() => showToast('User suspended (demo).')} tone="danger" />
        </div>
      ),
    },
  ]

  const supportColumns: TableColumn<SupportTicket>[] = [
    { key: 'id', header: 'Ticket', render: (row) => row.id },
    { key: 'subject', header: 'Subject', render: (row) => row.subject },
    { key: 'requester', header: 'Requester', render: (row) => row.requester },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => <StatusBadge tone={row.priority === 'critical' ? 'danger' : row.priority === 'high' ? 'warning' : 'info'}>{row.priority}</StatusBadge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge tone={row.status === 'resolved' ? 'success' : row.status === 'escalated' ? 'danger' : 'info'}>{row.status}</StatusBadge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex gap-1.5">
          <ActionButton label="Resolve" onClick={() => showToast('Ticket marked resolved (demo).')} />
          <ActionButton label="Escalate" onClick={() => showToast('Ticket escalated (demo).')} tone="danger" />
          <ActionButton label="Assign" onClick={() => showToast('Assigned to team member (demo).')} />
          <ActionButton label="Close" onClick={() => showToast('Ticket closed (demo).')} />
        </div>
      ),
    },
  ]

  function openAction(report: AdminReport, nextAction: ReportAction) {
    setTarget(report)
    setAction(nextAction)
    setInternalNotes('')
    setAdminDecision('')
  }

  const onConfirmAction = async () => {
    if (!target || !action) return

    setActionLoading(true)
    try {
      if (action === 'close') {
        const updated = await adminApi.resolveReport(target.id)
        if (updated) {
          setReports((prev) => prev.map((report) => (report.id === updated.id ? updated : report)))
          showToast('Case closed successfully.')
        }
      } else if (action === 'ban') {
        await adminApi.banUserFromReport(target.id)
        showToast('Target user banned.')
      } else {
        showToast(`${action[0].toUpperCase()}${action.slice(1)} action executed.`)
      }
      setTarget(null)
      setAction(null)
    } catch {
      showToast('Failed to process moderation action.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Moderation Hub"
        subtitle="Reports, disputes, chat safety and support operations"
        action={
          <SectionTabs
            options={[
              { key: 'reports', label: 'Reports & Disputes' },
              { key: 'chat', label: 'Chat Moderation' },
              { key: 'support', label: 'Support Center' },
            ]}
            value={panel}
            onChange={(next) => navigate(`/admin/reports${next === 'reports' ? '' : `?panel=${next}`}`)}
          />
        }
      >
        {panel === 'reports' ? (
          <div className="space-y-4">
            <Table
              columns={reportColumns}
              rows={reports}
              rowKey={(row) => row.id}
              loading={loading}
              emptyText="No reports found."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#E5D6C4] bg-[#FCF7F0] p-4">
                <h4 className="text-sm font-bold text-[#3E3027]">Evidence Preview</h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[#DDBA95] to-[#B98A5A]" />
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[#D3AA82] to-[#9B6A3C]" />
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5D6C4] bg-[#FCF7F0] p-4">
                <h4 className="text-sm font-bold text-[#3E3027]">Admin Notes</h4>
                <textarea
                  value={internalNotes}
                  onChange={(event) => setInternalNotes(event.target.value)}
                  rows={3}
                  placeholder="Add private notes for the moderation team"
                  className="mt-2 w-full rounded-lg border border-[#DCCCB8] bg-white px-3 py-2 text-sm outline-none focus:border-[#B99168]"
                />
                <h4 className="mt-3 text-sm font-bold text-[#3E3027]">Decision Summary</h4>
                <textarea
                  value={adminDecision}
                  onChange={(event) => setAdminDecision(event.target.value)}
                  rows={3}
                  placeholder="Document final decision and rationale"
                  className="mt-2 w-full rounded-lg border border-[#DCCCB8] bg-white px-3 py-2 text-sm outline-none focus:border-[#B99168]"
                />
              </div>
            </div>
          </div>
        ) : panel === 'chat' ? (
          <Table
            columns={flaggedColumns}
            rows={flaggedConversations}
            rowKey={(row) => row.id}
            loading={false}
            emptyText="No reported conversations."
          />
        ) : (
          <div className="space-y-4">
            <Table
              columns={supportColumns}
              rows={supportTickets}
              rowKey={(row) => row.id}
              loading={false}
              emptyText="No support tickets."
            />
            <div className="rounded-2xl border border-[#E5D6C4] bg-[#FCF7F0] p-4">
              <h4 className="text-sm font-bold text-[#3E3027]">Ticket Detail Panel</h4>
              <div className="mt-2 space-y-2 text-sm">
                <p><span className="font-semibold">Customer:</span> Fatima N.</p>
                <p><span className="font-semibold">Conversation:</span> "I was charged twice and host declined support."</p>
                <p><span className="font-semibold">Internal reply:</span> "Escalated to payments team, refund initiated."</p>
              </div>
            </div>
          </div>
        )}
      </SurfaceCard>

      <Modal
        open={Boolean(target && action)}
        title={action ? `${action[0].toUpperCase()}${action.slice(1)} case` : 'Case action'}
        message={target ? `Apply ${action} to report #${target.id} (${target.target})?` : ''}
        confirmLabel={action ? `${action[0].toUpperCase()}${action.slice(1)}` : 'Confirm'}
        onCancel={() => { setAction(null); setTarget(null) }}
        onConfirm={onConfirmAction}
        isLoading={actionLoading}
      />
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  tone = 'neutral',
}: {
  label: string
  onClick: () => void
  tone?: 'neutral' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
        tone === 'danger'
          ? 'border-[#E3BBB5] bg-[#FAEBEA] text-[#8E2E29] hover:bg-[#F5DEDB]'
          : 'border-[#D8C8B3] bg-[#F9F3EA] text-[#4B3A2E] hover:bg-[#EFE2D5]'
      }`}
    >
      {label}
    </button>
  )
}
