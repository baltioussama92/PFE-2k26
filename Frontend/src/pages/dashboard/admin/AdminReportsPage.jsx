import React, { useState } from 'react'
import { reports as seedReports } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminTable from '../../../components/admin/AdminTable'
import AdminButton from '../../../components/admin/AdminButton'
import StatusBadge from '../../../components/admin/StatusBadge'

const columns = ['Reporter', 'Reported User', 'Reason', 'Date', 'Status', 'Actions']

export default function AdminReportsPage() {
  const [reports, setReports] = useState(seedReports)

  const updateStatus = (id, status) => {
    setReports((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  return (
    <AdminPanelCard title="Reports" subtitle="Handle platform complaints">
      <AdminTable
        columns={columns}
        data={reports}
        renderRow={(report) => (
          <tr key={report.id}>
            <td>{report.reporter}</td>
            <td>{report.reportedUser}</td>
            <td>{report.reason}</td>
            <td>{report.date}</td>
            <td>
              <StatusBadge value={report.status} />
            </td>
            <td>
              <div className="admin-action-row">
                <AdminButton variant="ghost" onClick={() => updateStatus(report.id, 'Under Review')}>
                  Review Report
                </AdminButton>
                <AdminButton onClick={() => updateStatus(report.id, 'Resolved')}>Take Action</AdminButton>
                <AdminButton variant="danger" onClick={() => updateStatus(report.id, 'Resolved')}>
                  Resolve Report
                </AdminButton>
              </div>
            </td>
          </tr>
        )}
      />
    </AdminPanelCard>
  )
}
