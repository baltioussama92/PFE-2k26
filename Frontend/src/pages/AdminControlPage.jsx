import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, Users, Building2, CheckCircle2, Ban, Loader2 } from 'lucide-react'
import { adminService } from '../services/adminService'
import { useNotifications } from '../context/NotificationContext'

export default function AdminControlPage({ user }) {
  const { notify } = useNotifications()
  const [users, setUsers] = useState([])
  const [pendingListings, setPendingListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyUserId, setBusyUserId] = useState(null)
  const [busyPropertyId, setBusyPropertyId] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersData, pendingData] = await Promise.all([
        adminService.listUsers(),
        adminService.pendingListings(),
      ])
      setUsers(usersData)
      setPendingListings(pendingData)
    } catch {
      notify('Impossible de charger les données d’administration.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/profile" replace />
  }

  const blockUser = async (id) => {
    setBusyUserId(id)
    try {
      const updated = await adminService.blockUser(id)
      setUsers((prev) => prev.map((entry) => (String(entry.id) === String(id) ? updated : entry)))
      notify('Utilisateur bloqué. Le JWT sera rejeté à la prochaine requête.', 'success')
    } catch {
      notify('Blocage utilisateur impossible.', 'error')
    } finally {
      setBusyUserId(null)
    }
  }

  const approveListing = async (id) => {
    setBusyPropertyId(id)
    try {
      await adminService.verifyProperty(id)
      setPendingListings((prev) => prev.filter((entry) => String(entry.id) !== String(id)))
      notify('Annonce approuvée et publiée.', 'success')
    } catch {
      notify('Validation de l’annonce impossible.', 'error')
    } finally {
      setBusyPropertyId(null)
    }
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary-500" />
            Admin Control & Governance
          </h1>
          <p className="text-primary-500 text-sm mt-1">Modération des utilisateurs et validation des annonces propriétaires.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="bg-white border border-primary-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-bold text-primary-900 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-500" />
                Admin Table — Users
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-primary-500 border-b border-primary-200">
                      <th className="py-2 pr-3">Nom</th>
                      <th className="py-2 pr-3">Email</th>
                      <th className="py-2 pr-3">Rôle</th>
                      <th className="py-2 pr-3">Statut</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((entry) => {
                      const isBlocked = entry.banned === true
                      const disabled = isBlocked || busyUserId === entry.id
                      return (
                        <tr key={entry.id} className="border-b border-primary-100 last:border-none">
                          <td className="py-3 pr-3 text-primary-900 font-medium">{entry.fullName || entry.name || 'N/A'}</td>
                          <td className="py-3 pr-3 text-primary-700">{entry.email}</td>
                          <td className="py-3 pr-3 text-primary-700">{entry.role}</td>
                          <td className="py-3 pr-3">
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${isBlocked ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-700'}`}>
                              {isBlocked ? 'BLOCKED' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => blockUser(entry.id)}
                              disabled={disabled}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              <Ban className="w-4 h-4" />
                              {isBlocked ? 'Blocked' : 'Block'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-primary-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-bold text-primary-900 flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary-500" />
                Pending Approval Queue
              </h2>

              {pendingListings.length === 0 ? (
                <p className="text-sm text-primary-500">Aucune annonce en attente.</p>
              ) : (
                <div className="space-y-3">
                  {pendingListings.map((listing) => (
                    <div key={listing.id} className="rounded-xl border border-primary-100 bg-primary-50/60 p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-primary-900">{listing.title}</p>
                        <p className="text-xs text-primary-600">{listing.location} · {listing.pricePerNight} TND</p>
                        <p className="text-[11px] text-amber-700 mt-1">Status: PENDING (invisible au public)</p>
                      </div>
                      <button
                        onClick={() => approveListing(listing.id)}
                        disabled={busyPropertyId === listing.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-60"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {busyPropertyId === listing.id ? 'Validation…' : 'Approve'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
