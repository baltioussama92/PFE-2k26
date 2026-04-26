import { useEffect, useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import type { AdminPayment } from '../services/adminApi'
import { MetricCard, MiniBarChart, MiniLineChart, SectionTabs, StatusBadge, SurfaceCard } from '../components/ui'
import { API_BASE_URL, apiClient, getStoredAuthToken } from '../../api/apiClient'
import { ENDPOINTS } from '../../api/endpoints'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

type PaymentsPanel = 'finance' | 'analytics'

const monthlyRevenue = [124, 132, 140, 151, 163, 158, 172, 180, 191, 205, 198, 216]
const monthlyCommission = [22, 24, 26, 28, 31, 29, 33, 35, 37, 39, 38, 41]

interface FinanceSummaryResponse {
  grossRevenue?: number
  estimatedPayouts?: number
  platformFees?: number
}

export default function Payments() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { showToast } = useAdminToast()

  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [summary, setSummary] = useState<FinanceSummaryResponse>({})
  const [payouts, setPayouts] = useState<Array<{ id: string; host: string; amount: number; dueAt: string }>>([])
  const [refunds, setRefunds] = useState<Array<{ id: string; booking: string; amount: number; status: string }>>([])

  const panel = (params.get('panel') === 'analytics' ? 'analytics' : 'finance') as PaymentsPanel

  useEffect(() => {
    let active = true

    const loadPayments = async () => {
      try {
        const [paymentsResponse, summaryResponse, payoutsResponse, refundsResponse] = await Promise.all([
          apiClient.get<any[]>(ENDPOINTS.admin.financePaymentsHistory),
          apiClient.get<FinanceSummaryResponse>(ENDPOINTS.admin.financeSummary),
          apiClient.get<any[]>(ENDPOINTS.admin.financePayouts),
          apiClient.get<any[]>(ENDPOINTS.admin.financeRefunds),
        ])

        if (!active) return
        const mapped = (paymentsResponse.data || []).map((row, index) => ({
          id: Number(String(row?.bookingId || row?.id || index + 1).replace(/\D/g, '')) || index + 1,
          user: String(row?.guestId || row?.hostId || 'User'),
          userId: Number(String(row?.guestId || row?.hostId || 0).replace(/\D/g, '')) || undefined,
          amount: Number(row?.amount || row?.grossAmount || row?.refundAmount || 0),
          status: String(row?.status || '').toLowerCase() === 'processed' || String(row?.status || '').toLowerCase() === 'ready'
            ? 'paid'
            : String(row?.status || '').toLowerCase() === 'pending'
              ? 'pending'
              : 'failed',
          date: String(row?.createdAt || '').slice(0, 10),
        } as AdminPayment))

        setPayments(mapped)
        setSummary(summaryResponse.data || {})
        setPayouts((payoutsResponse.data || []).map((row: any, index: number) => ({
          id: String(row?.id || row?.payoutId || index + 1),
          host: String(row?.hostName || row?.hostId || 'Host'),
          amount: Number(row?.amount || row?.netAmount || row?.grossAmount || 0),
          dueAt: String(row?.dueAt || row?.createdAt || row?.scheduledAt || '').slice(0, 10),
        })))
        setRefunds((refundsResponse.data || []).map((row: any, index: number) => ({
          id: String(row?.id || row?.refundId || index + 1),
          booking: String(row?.bookingId || row?.bookingRef || 'Booking'),
          amount: Number(row?.amount || row?.refundAmount || 0),
          status: String(row?.status || 'pending'),
        })))
      } catch {
        showToast('Failed to load payments.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPayments()

    return () => {
      active = false
    }
  }, [showToast])

  const totals = useMemo(() => {
    const revenue = Number(summary.grossRevenue || payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0))
    const pendingPayouts = Number(summary.estimatedPayouts || payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))
    const commission = Number(summary.platformFees || revenue * 0.12)
    const refunds = payments.filter((p) => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
    return { revenue, pendingPayouts, refunds, commission }
  }, [payments, summary])

  const downloadInvoice = async (payment: AdminPayment) => {
    try {
      const token = getStoredAuthToken()
      const response = await fetch(`${API_BASE_URL}/api${ENDPOINTS.admin.financeInvoiceDownload(payment.id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) {
        throw new Error('Failed to download invoice.')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${payment.id}.txt`
      link.click()
      window.URL.revokeObjectURL(url)
      showToast('Invoice downloaded.')
    } catch {
      showToast('Failed to download invoice.', 'error')
    }
  }

  const exportFinance = async (format: 'csv' | 'pdf') => {
    try {
      const token = getStoredAuthToken()
      const response = await fetch(`${API_BASE_URL}/api${ENDPOINTS.admin.financeExport}?format=${format}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) {
        throw new Error('Failed to export finance data.')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finance-export.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
      showToast(`Export ${format.toUpperCase()} generated.`)
    } catch {
      showToast(`Failed to export ${format.toUpperCase()}.`, 'error')
    }
  }

  const columns = useMemo<TableColumn<AdminPayment>[]>(() => [
    { key: 'id', header: 'Payment ID', render: (row) => `PAY-${row.id}` },
    { key: 'user', header: 'User', render: (row) => row.user },
    { key: 'amount', header: 'Amount', render: (row) => money.format(row.amount) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge tone={row.status === 'paid' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'}>
          {row.status}
        </StatusBadge>
      ),
    },
    { key: 'date', header: 'Date', render: (row) => row.date },
    {
      key: 'invoice',
      header: 'Invoice',
      render: (row) => (
        <button
          type="button"
          onClick={() => downloadInvoice(row)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B3] bg-[#F9F3EA] px-2 py-1 text-[11px] font-semibold text-[#4B3A2E] transition hover:bg-[#EFE2D5]"
        >
          <FileText size={12} />
          Download
        </button>
      ),
    },
  ], [showToast])

  return (
    <div className="space-y-6">
      <SurfaceCard
        title="Revenue & Payments"
        subtitle="Track revenue, payouts, refunds and commissions"
        action={
          <SectionTabs
            options={[
              { key: 'finance', label: 'Finance Board' },
              { key: 'analytics', label: 'Analytics' },
            ]}
            value={panel}
            onChange={(next) => navigate(`/admin/payments${next === 'analytics' ? '?panel=analytics' : ''}`)}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Revenue" value={money.format(totals.revenue)} tone="success" />
          <MetricCard label="Pending Payouts" value={money.format(totals.pendingPayouts)} tone="warning" />
          <MetricCard label="Refund Tracking" value={money.format(totals.refunds)} tone="danger" />
          <MetricCard label="Commission (12%)" value={money.format(totals.commission)} tone="info" />
        </div>
      </SurfaceCard>

      {panel === 'finance' ? (
        <>
          <SurfaceCard
            title="Payment History"
            subtitle="Transactions, payout and refund monitoring"
            action={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportFinance('csv')}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B3] bg-[#F9F3EA] px-3 py-2 text-xs font-semibold text-[#4B3A2E] transition hover:bg-[#EFE2D5]"
                >
                  <Download size={14} />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => exportFinance('pdf')}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8B3] bg-[#F9F3EA] px-3 py-2 text-xs font-semibold text-[#4B3A2E] transition hover:bg-[#EFE2D5]"
                >
                  <FileText size={14} />
                  Export PDF
                </button>
              </div>
            }
          >
            <Table
              columns={columns}
              rows={payments}
              rowKey={(row) => row.id}
              loading={loading}
              emptyText="No payment records found."
            />
          </SurfaceCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <SurfaceCard title="Payout Tracking" subtitle="Upcoming host payouts">
              <ul className="space-y-2 text-sm text-[#4E3D30]">
                  {payouts.length > 0 ? payouts.map((payout) => (
                    <li key={payout.id} className="rounded-lg border border-[#E5D6C4] bg-[#FCF7F0] p-2">
                      {payout.host} - {money.format(payout.amount)} - due {payout.dueAt || 'soon'}
                    </li>
                  )) : <li className="rounded-lg border border-[#E5D6C4] bg-[#FCF7F0] p-2">No payout records found.</li>}
              </ul>
            </SurfaceCard>

            <SurfaceCard title="Refund Tracking" subtitle="Open refund workflows">
              <ul className="space-y-2 text-sm text-[#4E3D30]">
                  {refunds.length > 0 ? refunds.map((refund) => (
                    <li key={refund.id} className="rounded-lg border border-[#E9C3BD] bg-[#FDEFEF] p-2">
                      {refund.booking} - {money.format(refund.amount)} - {refund.status}
                    </li>
                  )) : <li className="rounded-lg border border-[#E9C3BD] bg-[#FDEFEF] p-2">No refund records found.</li>}
              </ul>
            </SurfaceCard>
          </div>
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard title="Monthly Revenue Trend" subtitle="Gross platform revenue">
            <MiniLineChart points={monthlyRevenue} />
          </SurfaceCard>

          <SurfaceCard title="Monthly Commission" subtitle="Platform earnings from commissions">
            <MiniLineChart points={monthlyCommission} />
          </SurfaceCard>

          <SurfaceCard title="Revenue by Channel" subtitle="Card, wallet, bank transfer" className="lg:col-span-2">
            <MiniBarChart data={[53, 31, 16]} labels={['Card', 'Wallet', 'Transfer']} />
          </SurfaceCard>
        </div>
      )}
    </div>
  )
}
