import React, { useState } from 'react'
import { houses as seedHouses } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminTable from '../../../components/admin/AdminTable'
import AdminButton from '../../../components/admin/AdminButton'
import StatusBadge from '../../../components/admin/StatusBadge'

const columns = ['House Title', 'Host Name', 'Location', 'Price/Night', 'Listing Status', 'Actions']

export default function AdminHousesPage() {
  const [houses, setHouses] = useState(seedHouses)

  const approveListing = (id) => {
    setHouses((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item)))
  }

  const removeListing = (id) => {
    setHouses((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <AdminPanelCard title="Houses Management" subtitle="Review and moderate listings">
      <AdminTable
        columns={columns}
        data={houses}
        renderRow={(house) => (
          <tr key={house.id}>
            <td>{house.title}</td>
            <td>{house.host}</td>
            <td>{house.location}</td>
            <td>${house.price}</td>
            <td>
              <StatusBadge value={house.status} />
            </td>
            <td>
              <div className="admin-action-row">
                <AdminButton onClick={() => approveListing(house.id)}>Approve Listing</AdminButton>
                <AdminButton variant="ghost">View Details</AdminButton>
                <AdminButton variant="danger" onClick={() => removeListing(house.id)}>
                  Remove Listing
                </AdminButton>
              </div>
            </td>
          </tr>
        )}
      />
    </AdminPanelCard>
  )
}
