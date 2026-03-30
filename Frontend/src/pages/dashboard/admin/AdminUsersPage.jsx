import React, { useMemo, useState } from 'react'
import { users as seedUsers } from '../../../data/adminData'
import AdminPanelCard from '../../../components/admin/AdminPanelCard'
import AdminTable from '../../../components/admin/AdminTable'
import AdminButton from '../../../components/admin/AdminButton'
import StatusBadge from '../../../components/admin/StatusBadge'

const columns = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Actions']

export default function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [users, setUsers] = useState(seedUsers)

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase()
    return users.filter((user) => {
      const matchQuery = !key || [user.id, user.name, user.email].join(' ').toLowerCase().includes(key)
      const matchRole = roleFilter === 'All' || user.role === roleFilter
      return matchQuery && matchRole
    })
  }, [query, roleFilter, users])

  const suspendUser = (id) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: item.status === 'Suspended' ? 'Active' : 'Suspended' } : item))
    )
  }

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <AdminPanelCard
      title="Users Management"
      subtitle="Manage guests and hosts"
      rightSlot={<span className="admin-muted">{filtered.length} users</span>}
    >
      <div className="admin-toolbar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="admin-input"
          placeholder="Search by ID, name, or email"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-select">
          <option>All</option>
          <option>Guest</option>
          <option>Host</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        renderRow={(user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <StatusBadge value={user.status} />
            </td>
            <td>
              <div className="admin-action-row">
                <AdminButton variant="ghost">View Profile</AdminButton>
                <AdminButton variant="ghost" onClick={() => suspendUser(user.id)}>
                  {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                </AdminButton>
                <AdminButton variant="danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </AdminButton>
              </div>
            </td>
          </tr>
        )}
      />
    </AdminPanelCard>
  )
}
