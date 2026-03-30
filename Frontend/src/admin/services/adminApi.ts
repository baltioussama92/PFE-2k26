import { apiClient } from '../../api/apiClient'
import { ENDPOINTS } from '../../api/endpoints'
import type { BookingResponse, PropertyResponse, UserDto } from '../../utils/contracts'

export type UserRole = 'guest' | 'host'
export type UserStatus = 'active' | 'banned'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export type ListingStatus = 'pending' | 'approved'

export interface AdminListing {
  id: number
  title: string
  host: string
  location: string
  status: ListingStatus
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

export interface AdminBooking {
  id: number
  guest: string
  property: string
  dates: string
  status: BookingStatus
}

export type PaymentStatus = 'paid' | 'pending' | 'failed'

export interface AdminPayment {
  id: number
  user: string
  amount: number
  status: PaymentStatus
  date: string
}

export interface AdminReport {
  id: number
  reporter: string
  reason: string
  target: string
  targetType: 'user' | 'listing'
  resolved: boolean
}

export interface AdminSettings {
  commissionPercentage: number
  enableSmartPricing: boolean
  enableNewHostOnboarding: boolean
  emailNotifications: boolean
  inAppNotifications: boolean
}

export interface DashboardStats {
  totalUsers: number
  totalListings: number
  totalBookings: number
  revenue: number
}

export interface ActivityRow {
  id: number
  action: string
  actor: string
  when: string
}

interface AdminSummaryResponse {
  totalUsers?: number
  totalProperties?: number
  totalBookings?: number
}

const SETTINGS_STORAGE_KEY = 'adminSettings'
const reportToListingMap = new Map<number, number>()

const defaultSettings: AdminSettings = {
  commissionPercentage: 12,
  enableSmartPricing: true,
  enableNewHostOnboarding: true,
  emailNotifications: true,
  inAppNotifications: true,
}

const toNumberId = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const mapUserRole = (role: string | undefined): UserRole => {
  const normalized = String(role || '').toUpperCase()
  return normalized === 'HOST' || normalized === 'PROPRIETOR' || normalized === 'PROPRIETAIRE'
    ? 'host'
    : 'guest'
}

const mapUser = (user: UserDto): AdminUser => ({
  id: toNumberId(user.id),
  name: user.fullName || user.name || `User #${user.id}`,
  email: user.email,
  role: mapUserRole(user.role),
  status: user.banned ? 'banned' : 'active',
})

const mapListing = (listing: PropertyResponse, isPending: boolean): AdminListing => ({
  id: toNumberId(listing.id),
  title: listing.title,
  host: listing.hostId ? `Host #${listing.hostId}` : 'Unknown host',
  location: listing.location,
  status: isPending ? 'pending' : 'approved',
})

const mapBookingStatus = (status: string | undefined): BookingStatus => {
  const normalized = String(status || '').toUpperCase()
  if (normalized === 'CONFIRMED' || normalized === 'COMPLETED') return 'confirmed'
  if (normalized === 'CANCELLED' || normalized === 'REJECTED') return 'cancelled'
  return 'pending'
}

const mapBooking = (booking: BookingResponse): AdminBooking => ({
  id: toNumberId(booking.id),
  guest: booking.guestId ? `Guest #${booking.guestId}` : 'Unknown guest',
  property: booking.listingTitle || `Listing #${booking.listingId}`,
  dates: `${booking.checkInDate} to ${booking.checkOutDate}`,
  status: mapBookingStatus(booking.status),
})

const mapPaymentStatus = (status: string | undefined): PaymentStatus => {
  const normalized = String(status || '').toUpperCase()
  if (normalized === 'CONFIRMED' || normalized === 'COMPLETED') return 'paid'
  if (normalized === 'PENDING') return 'pending'
  return 'failed'
}

const toPayments = (bookings: BookingResponse[]): AdminPayment[] => (
  bookings.map((booking) => ({
    id: toNumberId(booking.id),
    user: booking.guestId ? `User #${booking.guestId}` : 'Unknown user',
    amount: Number(booking.totalPrice || 0),
    status: mapPaymentStatus(booking.status),
    date: booking.createdAt ? String(booking.createdAt).slice(0, 10) : String(booking.checkInDate || ''),
  }))
)

const readStoredSettings = (): AdminSettings => {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (!raw) return { ...defaultSettings }

  try {
    const parsed = JSON.parse(raw)
    return {
      ...defaultSettings,
      ...parsed,
    }
  } catch {
    return { ...defaultSettings }
  }
}

const writeStoredSettings = (settings: AdminSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

async function fetchAdminBookings(): Promise<BookingResponse[]> {
  const { data } = await apiClient.get<BookingResponse[]>(ENDPOINTS.admin.bookings)
  return data
}

async function fetchPendingListings(): Promise<PropertyResponse[]> {
  const { data } = await apiClient.get<PropertyResponse[]>(ENDPOINTS.admin.pendingListings)
  return data
}

export const adminApi = {
  async getUsers(): Promise<AdminUser[]> {
    const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.admin.users)
    return data.map(mapUser)
  },

  async getListings(): Promise<AdminListing[]> {
    const [allListingsResponse, pendingListings] = await Promise.all([
      apiClient.get<PropertyResponse[]>(ENDPOINTS.properties.list),
      fetchPendingListings(),
    ])

    const pendingIds = new Set(pendingListings.map((entry) => toNumberId(entry.id)))
    const merged = [...allListingsResponse.data, ...pendingListings]
    const uniqById = new Map<number, PropertyResponse>()

    merged.forEach((entry) => {
      uniqById.set(toNumberId(entry.id), entry)
    })

    return Array.from(uniqById.values()).map((listing) => {
      const id = toNumberId(listing.id)
      return mapListing(listing, pendingIds.has(id) || Boolean(listing.pendingApproval))
    })
  },

  async getBookings(): Promise<AdminBooking[]> {
    const data = await fetchAdminBookings()
    return data.map(mapBooking)
  },

  async getPayments(): Promise<AdminPayment[]> {
    const data = await fetchAdminBookings()
    return toPayments(data)
  },

  async getReports(): Promise<AdminReport[]> {
    const pendingListings = await fetchPendingListings()
    reportToListingMap.clear()

    return pendingListings.map((listing, index) => {
      const reportId = index + 1
      reportToListingMap.set(reportId, toNumberId(listing.id))

      return {
        id: reportId,
        reporter: 'System',
        reason: 'Pending listing approval',
        target: listing.title,
        targetType: 'listing',
        resolved: false,
      }
    })
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const [summaryResponse, payments] = await Promise.all([
      apiClient.get<AdminSummaryResponse>(ENDPOINTS.dashboard.adminSummary),
      this.getPayments(),
    ])

    const revenue = payments
      .filter((payment) => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0)

    return {
      totalUsers: Number(summaryResponse.data.totalUsers || 0),
      totalListings: Number(summaryResponse.data.totalProperties || 0),
      totalBookings: Number(summaryResponse.data.totalBookings || 0),
      revenue,
    }
  },

  async getRecentActivity(): Promise<ActivityRow[]> {
    const [pendingListings, bookings, users] = await Promise.all([
      fetchPendingListings(),
      fetchAdminBookings(),
      this.getUsers(),
    ])

    const items: ActivityRow[] = []

    pendingListings.slice(0, 2).forEach((listing, idx) => {
      items.push({
        id: idx + 1,
        action: 'Listing pending approval',
        actor: listing.hostId ? `Host #${listing.hostId}` : 'Host',
        when: String(listing.createdAt || 'recently').slice(0, 16),
      })
    })

    bookings.slice(0, 1).forEach((booking, idx) => {
      items.push({
        id: 20 + idx,
        action: `Booking ${String(booking.status || '').toLowerCase()}`,
        actor: booking.guestId ? `Guest #${booking.guestId}` : 'Guest',
        when: String(booking.createdAt || booking.checkInDate || 'recently').slice(0, 16),
      })
    })

    const bannedCount = users.filter((user) => user.status === 'banned').length
    items.push({
      id: 99,
      action: 'Banned accounts monitored',
      actor: 'Admin',
      when: `${bannedCount} banned users`,
    })

    return items
  },

  async toggleUserBan(userId: number): Promise<AdminUser | null> {
    const { data } = await apiClient.put<UserDto>(ENDPOINTS.admin.blockUser(userId))
    return mapUser(data)
  },

  async approveListing(listingId: number): Promise<AdminListing | null> {
    const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.admin.verifyProperty(listingId))
    return mapListing(data, false)
  },

  async rejectListing(listingId: number): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.properties.byId(listingId))
  },

  async deleteListing(listingId: number): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.properties.byId(listingId))
  },

  async cancelBooking(bookingId: number): Promise<AdminBooking | null> {
    const { data } = await apiClient.put<BookingResponse>(ENDPOINTS.bookings.updateStatus(bookingId), {
      status: 'CANCELLED',
    })
    return mapBooking(data)
  },

  async resolveReport(reportId: number): Promise<AdminReport | null> {
    const listingId = reportToListingMap.get(reportId)
    if (!listingId) return null

    const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.admin.verifyProperty(listingId))

    return {
      id: reportId,
      reporter: 'System',
      reason: 'Pending listing approval',
      target: data.title,
      targetType: 'listing',
      resolved: true,
    }
  },

  async banUserFromReport(reportId: number): Promise<void> {
    // Report entries are currently mapped from pending listings only.
    // Keeping this as a no-op until backend exposes dedicated abuse-report endpoints.
    void reportId
  },

  async getSettings(): Promise<AdminSettings> {
    return readStoredSettings()
  },

  async saveSettings(nextSettings: AdminSettings): Promise<AdminSettings> {
    writeStoredSettings(nextSettings)
    return { ...nextSettings }
  },
}
