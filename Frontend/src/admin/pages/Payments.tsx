import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Table, { type TableColumn } from '../components/Table'
import { adminApi, type AdminPayment } from '../services/adminApi'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function Payments() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<AdminPayment[]>([])

  useEffect(() => {
    let active = true
    adminApi.getPayments()
      .then((data) => {
        if (active) setPayments(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const totalRevenue = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const columns = useMemo<TableColumn<AdminPayment>[]>(() => [
    { key: 'user', header: 'User', render: (row) => row.user },
    { key: 'amount', header: 'Amount', render: (row) => currency.format(row.amount) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className="capitalize">{row.status}</span>,
    },
    { key: 'date', header: 'Date', render: (row) => row.date },
  ], [])

  return (
    <div className="space-y-6">
      <Card title="Total Revenue">
        <p className="text-2xl font-semibold text-[#3A2D28]">{currency.format(totalRevenue)}</p>
      </Card>

      <Card title="Payments" subtitle="Track payment status and transactions">
        <Table
          columns={columns}
          rows={payments}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No payments found."
        />
      </Card>
    </div>
  )
}
