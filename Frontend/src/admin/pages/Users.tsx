import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Table, { type TableColumn } from '../components/Table'
import { useAdminToast } from '../components/AdminLayout'
import { adminApi, type AdminUser } from '../services/adminApi'

export default function Users() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [actionLoading, setActionLoading] = useState(false)



  useEffect(() => {
    let active = true
    adminApi.getUsers()
      .then((data) => {
        if (active) setUsers(data)
      })
      .catch(() => {
        showToast('Failed to load users.', 'error')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const deletedUserId = location.state?.deletedUserId
    if (!deletedUserId) return

    setUsers((prev) => prev.filter((user) => user.id !== Number(deletedUserId)))
    showToast('User removed from frontend view.')
    navigate('/admin/users', { replace: true, state: null })
  }, [location.state, navigate, showToast])

  const columns = useMemo<TableColumn<AdminUser>[]>(() => [
    { key: 'name', header: 'Name', render: (row) => row.name },
    { key: 'email', header: 'Email', render: (row) => row.email },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className="capitalize text-[#3A2D28]/85">{row.role}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === 'active' ? 'bg-[#EBE3DB] text-[#3A2D28]' : 'bg-[#CBAD8D] text-[#3A2D28]'
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
            className="rounded-lg border border-[#CBAD8D]/70 px-2.5 py-1 text-xs font-medium text-[#3A2D28] hover:bg-[#EBE3DB]"
            onClick={() => navigate(`/admin/users/${row.backendId || row.id}`, { state: { user: row } })}
          >
            View details
          </button>

          <button
            type="button"
            className="rounded-lg bg-[#3A2D28] px-2.5 py-1 text-xs font-medium text-[#FFFFFF] hover:bg-[#3A2D28]/90"
            onClick={() => setSelected(row)}
          >
            {row.status === 'active' ? 'Ban' : 'Unban'}
          </button>
        </div>
      ),
    },
  ], [])

  const onConfirmBanToggle = async () => {
    if (!selected) return
    setActionLoading(true)
    try {
      const updated = await adminApi.toggleUserBan(selected.backendId || selected.id)

      if (!updated) {
        showToast('User update failed.', 'error')
        return
      }

      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)))
      setSelected(null)
      showToast(`User ${updated.status === 'banned' ? 'banned' : 'unbanned'} successfully.`)
    } catch {
      showToast('Failed to update user status.', 'error')
    } finally {
      setActionLoading(false)
    }
  }



  return (
    <>
      <Card title="Users Management" subtitle="Moderate platform users and account status">
        <Table
          columns={columns}
          rows={users}
          rowKey={(row) => row.id}
          loading={loading}
          emptyText="No users found."
        />
      </Card>

      <Modal
        open={Boolean(selected)}
        title={selected?.status === 'active' ? 'Ban user' : 'Unban user'}
        message={`Are you sure you want to ${selected?.status === 'active' ? 'ban' : 'unban'} ${selected?.name}?`}
        confirmLabel={selected?.status === 'active' ? 'Ban' : 'Unban'}
        isLoading={actionLoading}
        onCancel={() => setSelected(null)}
        onConfirm={onConfirmBanToggle}
      />


    </>
  )
}
