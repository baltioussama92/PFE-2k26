import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import { useAdminToast } from '../components/AdminLayout'
import {
  adminApi,
  type AdminBooking,
  type AdminListing,
  type AdminUser,
  type AdminUserChatMessage,
  type AdminUserEarningsSummary,
  type AdminUserHistoryItem,
  type AdminUserPermissions,
} from '../services/adminApi'

type TabKey = 'overview' | 'history' | 'chats' | 'listings' | 'bookings' | 'earnings' | 'security'

interface LocationState {
  user?: AdminUser
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'History' },
  { key: 'chats', label: 'Chats' },
  { key: 'listings', label: 'Listings' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'security', label: 'Security' },
]

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const prettyWhen = (value: string): string => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString()
}

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function UserDetails() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const location = useLocation()
  const { showToast } = useAdminToast()

  const stateUser = (location.state as LocationState | null)?.user
  const parsedUserId = Number(userId)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [user, setUser] = useState<AdminUser | null>(stateUser || null)
  const [history, setHistory] = useState<AdminUserHistoryItem[]>([])
  const [chats, setChats] = useState<AdminUserChatMessage[]>([])
  const [listings, setListings] = useState<AdminListing[]>([])
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [earnings, setEarnings] = useState<AdminUserEarningsSummary>({
    totalEarnings: 0,
    paidBookings: 0,
    pendingBookings: 0,
    listingsCount: 0,
  })
  const [permissions, setPermissions] = useState<AdminUserPermissions>({
    canEditProfile: true,
    canChangePassword: true,
    canDeleteAccount: true,
    canViewMessages: true,
    canModerateListings: true,
  })

  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ next: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(parsedUserId)) {
      navigate('/admin/users', { replace: true })
      return
    }

    let active = true

    Promise.all([
      stateUser ? Promise.resolve(stateUser) : adminApi.getUserById(parsedUserId),
      adminApi.getUserHistory(parsedUserId),
      adminApi.getUserConversation(parsedUserId),
      adminApi.getUserListings(parsedUserId),
      adminApi.getUserBookings(parsedUserId),
      adminApi.getUserEarningsSummary(parsedUserId),
      adminApi.getUserPermissions(parsedUserId),
    ])
      .then(([foundUser, historyRows, chatRows, listingRows, bookingRows, earningRows, permissionRows]) => {
        if (!active) return
        if (!foundUser) {
          showToast('User not found.', 'error')
          navigate('/admin/users', { replace: true })
          return
        }

        setUser(foundUser)
        setProfileForm({ name: foundUser.name, email: foundUser.email })
        setHistory(historyRows)
        setChats(chatRows)
        setListings(listingRows)
        setBookings(bookingRows)
        setEarnings(earningRows)
        setPermissions(permissionRows)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [navigate, parsedUserId, showToast, stateUser])

  const overview = useMemo(() => ({
    listings: listings.length,
    bookings: bookings.length,
    paidBookings: earnings.paidBookings,
    earnings: earnings.totalEarnings,
  }), [bookings.length, earnings.paidBookings, earnings.totalEarnings, listings.length])

  const onSaveProfile = async () => {
    if (!user) return
    const name = profileForm.name.trim()
    const email = profileForm.email.trim()

    if (!name || !email) {
      showToast('Name and email are required.', 'error')
      return
    }

    setSavingProfile(true)
    const updated = await adminApi.updateUserProfileFrontendOnly(user, { name, email })
    setSavingProfile(false)
    setUser(updated)
    showToast('Profile updated successfully.')
  }

  const onChangePassword = async () => {
    if (!user) return
    if (!passwordForm.next || !passwordForm.confirm) {
      showToast('Please fill both password fields.', 'error')
      return
    }
    if (passwordForm.next.length < 8) {
      showToast('Password must have at least 8 characters.', 'error')
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showToast('Passwords do not match.', 'error')
      return
    }

    setSavingPassword(true)
    await adminApi.changeUserPasswordFrontendOnly(user.id, passwordForm.next)
    setSavingPassword(false)
    setPasswordForm({ next: '', confirm: '' })
    showToast('Password changed successfully.')
  }

  const onDeleteUser = async () => {
    if (!user) return
    const confirmed = window.confirm(`Delete ${user.name} account?`)
    if (!confirmed) return

    setDeleting(true)
    await adminApi.deleteUserFrontendOnly(user.id)
    setDeleting(false)
    showToast('Account deleted successfully.')
    navigate('/admin/users', { state: { deletedUserId: user.id } })
  }

  if (loading) {
    return (
      <Card title="User Details" subtitle="Loading user data...">
        <p className="text-sm text-[#3A2D28]/70">Please wait...</p>
      </Card>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <Card
        title={`User: ${user.name}`}
        subtitle={`${user.email} • ${user.role} • ${user.status}`}
        rightSlot={(
          <button
            type="button"
            className="rounded-lg border border-[#CBAD8D]/70 px-3 py-2 text-sm font-medium text-[#3A2D28] hover:bg-[#EBE3DB]"
            onClick={() => navigate('/admin/users')}
          >
            Back to users
          </button>
        )}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-[#3A2D28] text-[#FFFFFF]'
                    : 'bg-[#EBE3DB] text-[#3A2D28] hover:bg-[#CBAD8D]/55'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </Card>

      {activeTab === 'overview' && (
        <Card title="Overview" subtitle="Global summary of this user account">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
            <div className="rounded-2xl border border-[#CBAD8D]/40 bg-[#FFFFFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/60">Profile Snapshot</p>

              <div className="mt-3 flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    className="h-14 w-14 rounded-full border border-[#CBAD8D]/45 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#CBAD8D]/45 bg-[#EBE3DB] text-lg font-bold text-[#3A2D28]">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <p className="text-base font-bold text-[#3A2D28]">{user.name}</p>
                  <p className="text-sm text-[#3A2D28]/75">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[#3A2D28]/85">
                <ProfileRow label="User ID" value={String(user.id)} />
                <ProfileRow label="Username" value={user.username || 'Not set'} />
                <ProfileRow label="Role" value={user.role} />
                <ProfileRow label="Status" value={user.status} />
                <ProfileRow label="Verified" value={typeof user.isVerified === 'boolean' ? (user.isVerified ? 'Yes' : 'No') : 'Unknown'} />
                <ProfileRow label="Joined" value={user.createdAt ? prettyWhen(user.createdAt) : 'N/A'} />
              </div>

              <div className="mt-4 rounded-xl border border-[#CBAD8D]/35 bg-[#FAF7F3] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/60">Bio</p>
                <p className="mt-1 text-sm text-[#3A2D28]/85">{user.bio || 'No bio provided by this user.'}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat title="Listings" value={String(overview.listings)} />
              <Stat title="Bookings" value={String(overview.bookings)} />
              <Stat title="Paid Bookings" value={String(overview.paidBookings)} />
              <Stat title="Total Earnings" value={money.format(overview.earnings)} />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card title="Profile History" subtitle="Recent account activity trail">
          {history.length === 0 ? (
            <p className="text-sm text-[#3A2D28]/70">No history entries available.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#CBAD8D]/35 bg-[#FFFFFF] p-3">
                  <p className="text-sm font-semibold text-[#3A2D28]">{item.label}</p>
                  <p className="mt-0.5 text-sm text-[#3A2D28]/80">{item.description}</p>
                  <p className="mt-1 text-xs text-[#3A2D28]/60">{prettyWhen(item.when)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'chats' && (
        <Card title="Chats" subtitle="Conversation records for this user">
          {!permissions.canViewMessages ? (
            <p className="text-sm text-[#3A2D28]/70">You do not have permission to view messages for this user.</p>
          ) : chats.length === 0 ? (
            <p className="text-sm text-[#3A2D28]/70">No chat records returned for this user.</p>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div key={chat.id} className="rounded-xl border border-[#CBAD8D]/35 bg-[#FFFFFF] p-3">
                  <p className="text-xs text-[#3A2D28]/60">
                    {prettyWhen(chat.createdAt)} • {chat.senderId} → {chat.receiverId}
                  </p>
                  <p className="mt-1 text-sm text-[#3A2D28]">{chat.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'listings' && (
        <Card title="Listings" subtitle="Properties owned by this user">
          {listings.length === 0 ? (
            <p className="text-sm text-[#3A2D28]/70">No listings found for this user.</p>
          ) : (
            <div className="space-y-2">
              {listings.map((listing) => (
                <div key={listing.id} className="rounded-xl border border-[#CBAD8D]/35 bg-[#FFFFFF] p-3">
                  <p className="text-sm font-semibold text-[#3A2D28]">{listing.title}</p>
                  <p className="text-sm text-[#3A2D28]/80">{listing.location}</p>
                  <p className="text-xs capitalize text-[#3A2D28]/65">Status: {listing.status}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'bookings' && (
        <Card title="Bookings" subtitle="Reservations where this user is guest or host">
          {bookings.length === 0 ? (
            <p className="text-sm text-[#3A2D28]/70">No bookings found for this user.</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-[#CBAD8D]/35 bg-[#FFFFFF] p-3">
                  <p className="text-sm font-semibold text-[#3A2D28]">{booking.property}</p>
                  <p className="text-sm text-[#3A2D28]/80">{booking.dates}</p>
                  <p className="text-xs capitalize text-[#3A2D28]/65">Status: {booking.status}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'earnings' && (
        <Card title="Earnings" subtitle="Revenue and spend summary from backend">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat title="Total Earnings" value={money.format(earnings.totalEarnings)} />
            <Stat title="Paid" value={String(earnings.paidBookings)} />
            <Stat title="Pending" value={String(earnings.pendingBookings)} />
            <Stat title="Owned Listings" value={String(earnings.listingsCount)} />
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Profile Settings" subtitle="Edit user name and email">
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/70">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-[#CBAD8D]/45 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]/60"
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/70">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-[#CBAD8D]/45 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]/60"
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <button
                type="button"
                disabled={savingProfile || !permissions.canEditProfile}
                className="rounded-lg bg-[#3A2D28] px-3 py-2 text-sm font-semibold text-[#FFFFFF] hover:bg-[#3A2D28]/90 disabled:opacity-60"
                onClick={onSaveProfile}
              >
                {savingProfile ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </Card>

          <Card title="Password & Danger Zone" subtitle="Change password or delete account">
            <div className="space-y-3">
              <div className="rounded-xl border border-[#CBAD8D]/35 bg-[#FAF7F3] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/60">Current Password</p>
                <p className="mt-1 text-sm font-semibold tracking-[0.2em] text-[#3A2D28]/80">••••••••••••</p>
                <p className="mt-1 text-xs text-[#3A2D28]/70">
                  Raw passwords are never returned by backend APIs for security reasons. Admin can only reset/change it.
                </p>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/70">
                New Password
              </label>
              <input
                className="w-full rounded-xl border border-[#CBAD8D]/45 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]/60"
                type="password"
                value={passwordForm.next}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
              />
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/70">
                Confirm Password
              </label>
              <input
                className="w-full rounded-xl border border-[#CBAD8D]/45 bg-[#FFFFFF] px-3 py-2 text-sm text-[#3A2D28] outline-none focus:border-[#3A2D28]/60"
                type="password"
                value={passwordForm.confirm}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
              />
              <button
                type="button"
                disabled={savingPassword || !permissions.canChangePassword}
                className="rounded-lg border border-[#CBAD8D]/70 px-3 py-2 text-sm font-semibold text-[#3A2D28] hover:bg-[#EBE3DB] disabled:opacity-60"
                onClick={onChangePassword}
              >
                {savingPassword ? 'Updating...' : 'Change password'}
              </button>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={deleting || !permissions.canDeleteAccount}
                  className="rounded-lg bg-[#CBAD8D] px-3 py-2 text-sm font-semibold text-[#3A2D28] hover:bg-[#CBAD8D]/85 disabled:opacity-60"
                  onClick={onDeleteUser}
                >
                  {deleting ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#CBAD8D]/35 bg-[#FFFFFF] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/65">{title}</p>
      <p className="mt-1 text-lg font-bold text-[#3A2D28]">{value}</p>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#CBAD8D]/25 bg-[#FCFAF8] px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#3A2D28]/65">{label}</span>
      <span className="text-sm font-medium text-[#3A2D28]">{value}</span>
    </div>
  )
}
