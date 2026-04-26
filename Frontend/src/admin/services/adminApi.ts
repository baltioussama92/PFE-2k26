import { API_BASE_URL, apiClient, getStoredAuthToken } from '../../api/apiClient'
import { ENDPOINTS } from '../../api/endpoints'
import type { BookingResponse, MessageResponse, PropertyResponse, UserDto } from '../../utils/contracts'

export type UserRole = 'guest' | 'host'
export type UserStatus = 'active' | 'banned'
export type GuestIdentityStatus = 'not_verified' | 'pending' | 'approved' | 'rejected'

export interface AdminUser {
  id: number
  backendId?: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  username?: string
  bio?: string
  avatar?: string
  createdAt?: string
  isVerified?: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
  identityStatus?: GuestIdentityStatus
  verificationLevel?: number
  rejectionReason?: string
  governmentIdFiles?: string[]
  otherAttachmentFiles?: string[]
  selfieFile?: string
  identitySubmittedAt?: string
}

export type ListingStatus = 'pending' | 'approved'

export interface AdminListing {
  id: number
  backendId?: string // Original MongoDB ObjectId for API calls
  title: string
  host: string
  hostId?: number
  location: string
  status: ListingStatus
  createdAt?: string
  description?: string
  pricePerNight?: number
  images?: string[]
  bedrooms?: number
  bathrooms?: number
  area?: number
  amenities?: string[]
  rating?: number
  imageFiles?: File[]
  imageFile?: File
  imagePreview?: string
}

export interface ListingDetails extends AdminListing {
  reviews?: number
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

export interface AdminBooking {
  id: number
  guest: string
  guestId?: number
  property: string
  listingId?: number
  host?: string
  hostId?: number
  dates: string
  status: BookingStatus
  totalPrice?: number
  createdAt?: string
}

export type PaymentStatus = 'paid' | 'pending' | 'failed'

export interface AdminPayment {
  id: number
  user: string
  userId?: number
  amount: number
  status: PaymentStatus
  date: string
}

export interface AdminUserHistoryItem {
  id: string
  label: string
  description: string
  when: string
}

export interface AdminUserChatMessage {
  id: string
  senderId: number
  receiverId: number
  content: string
  createdAt: string
}

export interface AdminUserEarningsSummary {
  totalEarnings: number
  paidBookings: number
  pendingBookings: number
  listingsCount: number
  totalSpent?: number
  currency?: string
}

export interface AdminUserPermissions {
  canEditProfile: boolean
  canChangePassword: boolean
  canDeleteAccount: boolean
  canViewMessages: boolean
  canModerateListings: boolean
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

export type HostDemandStatus = 'pending' | 'approved' | 'rejected'
export type IdVerificationStatus = 'pending' | 'verified' | 'rejected'

export interface HostDemand {
  id: number
  backendId?: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  status: HostDemandStatus
  submittedDate: string
  documents: string[]
  idDocument: string
  idVerificationStatus: IdVerificationStatus
  housePictures: string[]
  proposedPrice: number
  proposedLocation: string
  bio?: string
  notes?: string
}

interface HostDemandApiResponse {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  status: string
  submittedDate: string
  documents: string[]
  idDocument: string
  idVerificationStatus: string
  housePictures: string[]
  proposedPrice: number
  proposedLocation: string
  bio?: string
  notes?: string
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

interface AdminUserOverviewResponse {
  userId: string
  listingsCount: number
  bookingsAsGuestCount: number
  bookingsAsHostCount: number
  paidBookingsCount: number
  pendingBookingsCount: number
  totalEarnings: number
  totalSpent: number
}

interface AdminHistoryEventResponse {
  id: string
  type: string
  description: string
  metadata?: Record<string, unknown>
  createdAt?: string
}

interface AdminUserMessageResponse {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt?: string
  conversationId?: string
  isDeleted?: boolean
  moderationFlags?: string[]
}

interface AdminUserListingResponse {
  id: string
  title: string
  location: string
  status: string
  createdAt?: string
  pricePerNight?: number
  rating?: number
}

interface AdminUserBookingResponse {
  id: string
  listingId: string
  listingTitle?: string
  guestId?: string
  hostId?: string
  checkInDate: string
  checkOutDate: string
  status: string
  totalPrice?: number
  createdAt?: string
}

interface AdminMonthlyEarningsResponse {
  month: string
  earnings: number
  bookingsCount: number
}

interface AdminUserEarningsResponse {
  totalEarnings: number
  currency: string
  paidBookingsCount: number
  pendingPayoutCount: number
  lastPayoutAt?: string
  monthlyBreakdown: AdminMonthlyEarningsResponse[]
}

interface AdminActionResponse {
  success: boolean
  securityEventId?: string
  deletedAt?: string
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

const mockUsers: AdminUser[] = [
  { id: 101, name: 'Alice Martin', email: 'alice@maskan.com', role: 'host', status: 'active' },
  { id: 102, name: 'Yassine Amrani', email: 'yassine@maskan.com', role: 'guest', status: 'active' },
  { id: 103, name: 'Sara Benali', email: 'sara@maskan.com', role: 'guest', status: 'banned' },
  { id: 104, name: 'Karim El Fassi', email: 'karim@maskan.com', role: 'host', status: 'active' },
]

const mockListings: AdminListing[] = [
  { id: 201, title: 'Riad Atlas', host: 'Alice Martin', hostId: 101, location: 'Marrakech', status: 'approved' },
  { id: 202, title: 'Marina Flat', host: 'Karim El Fassi', hostId: 104, location: 'Casablanca', status: 'pending' },
  { id: 203, title: 'Ocean View Studio', host: 'Alice Martin', hostId: 101, location: 'Agadir', status: 'pending' },
]

const mockBookings: AdminBooking[] = [
  {
    id: 301,
    guest: 'Yassine Amrani',
    guestId: 102,
    property: 'Riad Atlas',
    listingId: 201,
    host: 'Alice Martin',
    hostId: 101,
    dates: '2026-04-04 to 2026-04-07',
    status: 'confirmed',
    totalPrice: 450,
    createdAt: '2026-03-30T10:00:00Z',
  },
  {
    id: 302,
    guest: 'Sara Benali',
    guestId: 103,
    property: 'Marina Flat',
    listingId: 202,
    host: 'Karim El Fassi',
    hostId: 104,
    dates: '2026-04-10 to 2026-04-12',
    status: 'pending',
    totalPrice: 300,
    createdAt: '2026-03-31T09:15:00Z',
  },
]

const mockReports: AdminReport[] = [
  {
    id: 401,
    reporter: 'System',
    reason: 'Pending listing approval',
    target: 'Marina Flat',
    targetType: 'listing',
    resolved: false,
  },
  {
    id: 402,
    reporter: 'Support',
    reason: 'Abusive behavior report',
    target: 'Sara Benali',
    targetType: 'user',
    resolved: false,
  },
]

const mockHostDemands: HostDemand[] = [
  {
    id: 501,
    userId: '102',
    userName: 'Yassine Amrani',
    userEmail: 'yassine@maskan.com',
    userPhone: '+212 612 345 678',
    status: 'pending',
    submittedDate: '2026-03-28T14:30:00Z',
    documents: ['https://via.placeholder.com/300x200?text=Tax+Return', 'https://via.placeholder.com/300x200?text=Bank+Statement'],
    idDocument: 'https://via.placeholder.com/300x400?text=National+ID',
    idVerificationStatus: 'verified',
    housePictures: [
      'https://via.placeholder.com/400x300?text=Living+Room',
      'https://via.placeholder.com/400x300?text=Bedroom',
      'https://via.placeholder.com/400x300?text=Kitchen',
    ],
    proposedPrice: 85,
    proposedLocation: 'Marrakech, Morocco',
    bio: 'Experienced property manager with 5 years in hospitality industry',
  },
  {
    id: 502,
    userId: '103',
    userName: 'Sara Benali',
    userEmail: 'sara@maskan.com',
    userPhone: '+212 698 765 432',
    status: 'pending',
    submittedDate: '2026-03-29T09:15:00Z',
    documents: [],
    idDocument: 'https://via.placeholder.com/300x400?text=ID+Card',
    idVerificationStatus: 'pending',
    housePictures: [
      'https://via.placeholder.com/400x300?text=Exterior',
    ],
    proposedPrice: 65,
    proposedLocation: 'Casablanca, Morocco',
    bio: 'New host with beautiful apartment near the beach',
  },
  {
    id: 503,
    userId: '104',
    userName: 'Karim El Fassi',
    userEmail: 'karim@maskan.com',
    userPhone: '+212 654 321 098',
    status: 'approved',
    submittedDate: '2026-03-15T11:20:00Z',
    documents: ['https://via.placeholder.com/300x200?text=License', 'https://via.placeholder.com/300x200?text=Insurance'],
    idDocument: 'https://via.placeholder.com/300x400?text=Approved+ID',
    idVerificationStatus: 'verified',
    housePictures: [
      'https://via.placeholder.com/400x300?text=Modern+Villa',
      'https://via.placeholder.com/400x300?text=Pool',
      'https://via.placeholder.com/400x300?text=Terrace',
    ],
    proposedPrice: 125,
    proposedLocation: 'Agadir, Morocco',
    bio: 'Luxury property manager with premium listings',
  },
]

const sleep = (ms: number) => new Promise((resolve) => {
  window.setTimeout(resolve, ms)
})

async function withFallback<T>(live: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await live()
  } catch {
    return fallback()
  }
}

const toNumberId = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

// Ensures unique IDs even when backend provides duplicates or zeros
const ensureUniqueIds = <T extends { id: number }>(items: T[]): T[] => {
  const seenIds = new Set<number>()
  let idCounter = Math.max(...items.map(i => i.id), 0) + 1

  return items.map((item) => {
    if (item.id > 0 && !seenIds.has(item.id)) {
      seenIds.add(item.id)
      return item
    }
    // Assign a new unique ID if the current one is 0 or already seen
    const newId = idCounter++
    seenIds.add(newId)
    return { ...item, id: newId }
  })
}

const mapUserRole = (role: string | undefined): UserRole => {
  const normalized = String(role || '').toUpperCase()
  return normalized === 'HOST' || normalized === 'PROPRIETOR' || normalized === 'PROPRIETAIRE'
    ? 'host'
    : 'guest'
}

const mapUser = (user: UserDto): AdminUser => ({
  id: toNumberId(user.id),
  backendId: user.id != null ? String(user.id) : undefined,
  name: user.fullName || user.name || `User #${user.id}`,
  email: user.email,
  role: mapUserRole(user.role),
  status: user.banned ? 'banned' : 'active',
  username: user.username || undefined,
  bio: user.bio || undefined,
  avatar: user.avatar || undefined,
  createdAt: user.createdAt ? String(user.createdAt) : undefined,
  isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : undefined,
  emailVerified: typeof user.emailVerified === 'boolean' ? user.emailVerified : undefined,
  phoneVerified: typeof user.phoneVerified === 'boolean' ? user.phoneVerified : undefined,
  identityStatus: (user.identityStatus as GuestIdentityStatus | undefined) || 'not_verified',
  verificationLevel: typeof user.verificationLevel === 'number' ? user.verificationLevel : undefined,
  rejectionReason: user.rejectionReason || undefined,
  governmentIdFiles: user.governmentIdFiles || [],
  otherAttachmentFiles: user.otherAttachmentFiles || [],
  selfieFile: user.selfieFile || undefined,
  identitySubmittedAt: user.identitySubmittedAt || undefined,
})

const mapHostDemandStatus = (status: string | undefined): HostDemandStatus => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'approved') return 'approved'
  if (normalized === 'rejected') return 'rejected'
  return 'pending'
}

const mapIdVerificationStatus = (status: string | undefined): IdVerificationStatus => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'verified' || normalized === 'approved') return 'verified'
  if (normalized === 'rejected') return 'rejected'
  return 'pending'
}

const mapHostDemand = (item: HostDemandApiResponse): HostDemand => ({
  id: toNumberId(item.id),
  backendId: item.id,
  userId: String(item.userId || item.id),
  userName: item.userName,
  userEmail: item.userEmail,
  userPhone: item.userPhone || undefined,
  status: mapHostDemandStatus(item.status),
  submittedDate: item.submittedDate,
  documents: item.documents || [],
  idDocument: item.idDocument,
  idVerificationStatus: mapIdVerificationStatus(item.idVerificationStatus),
  housePictures: item.housePictures || [],
  proposedPrice: Number(item.proposedPrice || 0),
  proposedLocation: item.proposedLocation || 'N/A',
  bio: item.bio || undefined,
  notes: item.notes || undefined,
})

const mapListing = (listing: PropertyResponse, isPending: boolean): AdminListing => ({
  id: toNumberId(listing.id),
  backendId: String(listing.id), // Preserve original backend ID
  title: listing.title,
  host: listing.hostId ? `Host #${listing.hostId}` : 'Unknown host',
  hostId: toNumberId(listing.hostId),
  location: listing.location,
  status: isPending ? 'pending' : 'approved',
  createdAt: String(listing.createdAt || ''),
  description: listing.description || '',
  pricePerNight: Number(listing.pricePerNight || listing.price || 0),
  images: listing.images || [],
  bedrooms: Number(listing.bedrooms || 0),
  bathrooms: Number(listing.bathrooms || 0),
  area: Number(listing.area || 0),
  amenities: listing.amenities || [],
  rating: Number(listing.rating || 0),
})

const mapAdminListingStatus = (status: string | undefined): ListingStatus => {
  const normalized = String(status || '').toUpperCase()
  return normalized.includes('PENDING') ? 'pending' : 'approved'
}

const mapAdminUserListing = (listing: AdminUserListingResponse): AdminListing => ({
  id: toNumberId(listing.id),
  title: listing.title,
  host: 'User listing',
  location: listing.location,
  status: mapAdminListingStatus(listing.status),
  createdAt: String(listing.createdAt || ''),
})

const mapBookingStatus = (status: string | undefined): BookingStatus => {
  const normalized = String(status || '').toUpperCase()
  if (normalized === 'CONFIRMED' || normalized === 'COMPLETED') return 'confirmed'
  if (normalized === 'CANCELLED' || normalized === 'REJECTED') return 'cancelled'
  return 'pending'
}

const mapBooking = (
  booking: BookingResponse,
  hostsByListingId?: Map<number, { host: string; hostId?: number }>,
): AdminBooking => {
  const listingId = toNumberId(booking.listingId)
  const hostInfo = hostsByListingId?.get(listingId)

  return {
    id: toNumberId(booking.id),
    guest: booking.guestId ? `Guest #${booking.guestId}` : 'Unknown guest',
    guestId: toNumberId(booking.guestId),
    property: booking.listingTitle || `Listing #${booking.listingId}`,
    listingId,
    host: hostInfo?.host || 'Unknown host',
    hostId: hostInfo?.hostId,
    dates: `${booking.checkInDate} to ${booking.checkOutDate}`,
    status: mapBookingStatus(booking.status),
    totalPrice: Number(booking.totalPrice || 0),
    createdAt: String(booking.createdAt || booking.checkInDate || ''),
  }
}

const mapAdminBooking = (booking: AdminUserBookingResponse): AdminBooking => ({
  id: toNumberId(booking.id),
  guest: booking.guestId ? `Guest #${booking.guestId}` : 'Unknown guest',
  guestId: toNumberId(booking.guestId),
  property: booking.listingTitle || `Listing #${booking.listingId}`,
  listingId: toNumberId(booking.listingId),
  host: booking.hostId ? `Host #${booking.hostId}` : 'Unknown host',
  hostId: toNumberId(booking.hostId),
  dates: `${booking.checkInDate} to ${booking.checkOutDate}`,
  status: mapBookingStatus(booking.status),
  totalPrice: Number(booking.totalPrice || 0),
  createdAt: String(booking.createdAt || booking.checkInDate || ''),
})

const mapPaymentStatus = (status: string | undefined): PaymentStatus => {
  const normalized = String(status || '').toUpperCase()
  if (normalized === 'CONFIRMED' || normalized === 'COMPLETED') return 'paid'
  if (normalized === 'PENDING') return 'pending'
  return 'failed'
}

const mapMockBookingPaymentStatus = (status: BookingStatus): PaymentStatus => {
  if (status === 'confirmed') return 'paid'
  if (status === 'pending') return 'pending'
  return 'failed'
}

const toPayments = (bookings: BookingResponse[]): AdminPayment[] => (
  bookings.map((booking) => ({
    id: toNumberId(booking.id),
    user: booking.guestId ? `User #${booking.guestId}` : 'Unknown user',
    userId: toNumberId(booking.guestId),
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

async function uploadPropertyImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const token = getStoredAuthToken()
  const response = await fetch(`${API_BASE_URL}/api/uploads/images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Image upload failed')
  }

  const data = await response.json() as { url?: string }
  if (!data.url) {
    throw new Error('Image upload response is missing URL')
  }

  return data.url
}

async function uploadPropertyImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadPropertyImage(file)))
}

export const adminApi = {
  async getUsers(): Promise<AdminUser[]> {
    return withFallback(async () => {
      const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.admin.users)
      const mapped = data.map(mapUser)
      return ensureUniqueIds(mapped)
    }, async () => {
      await sleep(200)
      return [...mockUsers]
    })
  },

  async getGuestVerificationRequests(): Promise<AdminUser[]> {
    const users = await this.getUsers()
    return users
      .filter((user) => user.identityStatus === 'pending')
      .sort((a, b) => {
        const left = a.identitySubmittedAt ? Date.parse(a.identitySubmittedAt) : 0
        const right = b.identitySubmittedAt ? Date.parse(b.identitySubmittedAt) : 0
        return right - left
      })
  },

  async approveGuestVerification(userId: number | string): Promise<AdminUser> {
    const { data } = await apiClient.patch<UserDto>(ENDPOINTS.admin.approveGuestVerification(userId), {})
    return mapUser(data)
  },

  async rejectGuestVerification(userId: number | string, reason?: string): Promise<AdminUser> {
    const { data } = await apiClient.patch<UserDto>(ENDPOINTS.admin.rejectGuestVerification(userId), {
      reason: reason || '',
    })
    return mapUser(data)
  },

  async getUserById(userId: number | string): Promise<AdminUser | null> {
    const users = await this.getUsers()
    const requested = String(userId)
    return users.find((user) => String(user.id) === requested || user.backendId === requested) || null
  },

  async getListings(): Promise<AdminListing[]> {
    return withFallback(async () => {
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

      const mapped = Array.from(uniqById.values()).map((listing) => {
        const id = toNumberId(listing.id)
        const hasPendingApproval = Boolean((listing as PropertyResponse & { pendingApproval?: boolean }).pendingApproval)
        return mapListing(listing, pendingIds.has(id) || hasPendingApproval)
      })
      return ensureUniqueIds(mapped)
    }, async () => {
      await sleep(220)
      return [...mockListings]
    })
  },

  async getListingDetails(listingId: number, backendId?: string): Promise<ListingDetails | null> {
    try {
      // Use backendId if available (for real backend calls), otherwise use listingId (for mock)
      const idToFetch = backendId || listingId
      const { data } = await apiClient.get<PropertyResponse>(ENDPOINTS.properties.byId(idToFetch))
      const listing = mapListing(data, false)
      return {
        ...listing,
        reviews: Number(data.reviewCount || 0),
      }
    } catch {
      const mockListing = mockListings.find((item) => item.id === listingId)
      if (mockListing) {
        return {
          ...mockListing,
          reviews: 5,
        }
      }
      return null
    }
  },

  async updateListing(listingId: number, payload: Partial<AdminListing>): Promise<AdminListing | null> {
    try {
      const updateData: Record<string, unknown> = {}
      if (payload.title !== undefined) updateData.title = payload.title
      if (payload.description !== undefined) updateData.description = payload.description
      if (payload.location !== undefined) updateData.location = payload.location
      if (payload.pricePerNight !== undefined) updateData.pricePerNight = payload.pricePerNight
      if (payload.bedrooms !== undefined) updateData.bedrooms = payload.bedrooms
      if (payload.bathrooms !== undefined) updateData.bathrooms = payload.bathrooms
      if (payload.area !== undefined) updateData.area = payload.area
      if (payload.amenities !== undefined) updateData.amenities = payload.amenities

      let finalImages: string[] | undefined = payload.images ? [...payload.images] : undefined

      if (payload.imageFiles && payload.imageFiles.length > 0) {
        const uploadedUrls = await uploadPropertyImages(payload.imageFiles)
        finalImages = [...(finalImages || []), ...uploadedUrls]
      } else if (payload.imageFile) {
        const uploadedUrl = await uploadPropertyImage(payload.imageFile)
        finalImages = [...(finalImages || []), uploadedUrl]
      } else if (payload.imagePreview) {
        finalImages = [...(finalImages || []), payload.imagePreview]
      }

      if (finalImages !== undefined) {
        updateData.images = finalImages
      }

      // Use backendId if available for real API calls
      const idToUse = payload.backendId || listingId
      const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.properties.byId(idToUse), updateData)
      return mapListing(data, false)
    } catch {
      return null
    }
  },

  async getBookings(): Promise<AdminBooking[]> {
    return withFallback(async () => {
      const [data, listings] = await Promise.all([
        fetchAdminBookings(),
        this.getListings(),
      ])

      const hostsByListingId = new Map<number, { host: string; hostId?: number }>()
      listings.forEach((listing) => {
        hostsByListingId.set(listing.id, {
          host: listing.host,
          hostId: listing.hostId,
        })
      })

      const mapped = data.map((booking) => mapBooking(booking, hostsByListingId))
      return ensureUniqueIds(mapped)
    }, async () => {
      await sleep(220)
      return [...mockBookings]
    })
  },

  async getUserBookings(userId: number | string): Promise<AdminBooking[]> {
    const { data } = await apiClient.get<AdminUserBookingResponse[]>(`${ENDPOINTS.admin.userBookings(userId)}?role=all`)

    const mapped = data.map(mapAdminBooking)
    return ensureUniqueIds(mapped)
  },

  async getPayments(): Promise<AdminPayment[]> {
    return withFallback(async () => {
      const data = await fetchAdminBookings()
      const mapped = toPayments(data)
      return ensureUniqueIds(mapped)
    }, async () => {
      await sleep(220)
      const mapped = mockBookings.map((booking) => ({
        id: booking.id,
        user: booking.guest,
        userId: booking.guestId,
        amount: booking.totalPrice || 0,
        status: mapMockBookingPaymentStatus(booking.status),
        date: String(booking.createdAt || '').slice(0, 10),
      }))
      return ensureUniqueIds(mapped)
    })
  },

  async getUserPayments(userId: number | string): Promise<AdminPayment[]> {
    const payments = await this.getPayments()
    return payments.filter((payment) => String(payment.userId) === String(userId))
  },

  async getUserListings(userId: number | string): Promise<AdminListing[]> {
    const { data } = await apiClient.get<AdminUserListingResponse[]>(ENDPOINTS.admin.userListings(userId))
    const mapped = data.map(mapAdminUserListing)
    return ensureUniqueIds(mapped)
  },

  async getUserConversation(userId: number | string): Promise<AdminUserChatMessage[]> {
    try {
      const { data } = await apiClient.get<AdminUserMessageResponse[]>(`${ENDPOINTS.admin.userMessages(userId)}?limit=100&direction=all`)

      return data.map((message) => ({
        id: String(message.id),
        senderId: toNumberId(message.senderId),
        receiverId: toNumberId(message.receiverId),
        content: message.content,
        createdAt: String(message.createdAt || ''),
      }))
    } catch {
      return []
    }
  },



  async getUserEarningsSummary(userId: number | string): Promise<AdminUserEarningsSummary> {
    const [overviewResponse, earningsResponse] = await Promise.all([
      apiClient.get<AdminUserOverviewResponse>(ENDPOINTS.admin.userOverview(userId)),
      apiClient.get<AdminUserEarningsResponse>(ENDPOINTS.admin.userEarnings(userId)),
    ])

    const overview = overviewResponse.data
    const earnings = earningsResponse.data

    return {
      totalEarnings: Number(earnings.totalEarnings || 0),
      paidBookings: Number(earnings.paidBookingsCount || 0),
      pendingBookings: Number(earnings.pendingPayoutCount || 0),
      listingsCount: Number(overview.listingsCount || 0),
      totalSpent: Number(overview.totalSpent || 0),
      currency: earnings.currency || 'USD',
    }
  },

  async getUserHistory(userId: number | string): Promise<AdminUserHistoryItem[]> {
    const { data } = await apiClient.get<AdminHistoryEventResponse[]>(`${ENDPOINTS.admin.userHistory(userId)}?limit=100`)

    return data.map((event) => ({
      id: String(event.id),
      label: String(event.type || 'EVENT').replaceAll('_', ' '),
      description: event.description || 'No description',
      when: String(event.createdAt || ''),
    }))
  },

  async updateUserProfile(user: AdminUser, payload: { name: string; email: string }): Promise<AdminUser> {
    const { data } = await apiClient.patch<UserDto>(ENDPOINTS.admin.updateUser(user.id), {
      fullName: payload.name,
      email: payload.email,
    })
    return mapUser(data)
  },

  async changeUserPassword(userId: number | string, newPassword: string): Promise<boolean> {
    const { data } = await apiClient.patch<AdminActionResponse>(ENDPOINTS.admin.updateUserPassword(userId), {
      newPassword,
      forceResetOnNextLogin: false,
    })
    return Boolean(data.success)
  },

  async deleteUser(userId: number | string): Promise<boolean> {
    const { data } = await apiClient.delete<AdminActionResponse>(ENDPOINTS.admin.deleteUser(userId))
    return Boolean(data.success)
  },

  async getUserPermissions(userId: number | string): Promise<AdminUserPermissions> {
    const { data } = await apiClient.get<AdminUserPermissions>(ENDPOINTS.admin.userPermissions(userId))
    return data
  },

  async getReports(): Promise<AdminReport[]> {
    const { data } = await apiClient.get<any[]>(ENDPOINTS.admin.reports)
    return (data || []).map((item, index) => ({
      id: toNumberId(item?.id) || index + 1,
      reporter: String(item?.reporterLabel || item?.reporterId || 'System'),
      reason: String(item?.reason || item?.category || 'Report'),
      target: String(item?.targetLabel || item?.targetId || 'Unknown target'),
      targetType: String(item?.targetType || '').toLowerCase() === 'user' ? 'user' : 'listing',
      resolved: ['resolved', 'closed'].includes(String(item?.status || '').toLowerCase()),
    }))
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

  async toggleUserBan(userId: number | string): Promise<AdminUser | null> {
    try {
      const { data } = await apiClient.put<UserDto>(ENDPOINTS.admin.blockUser(userId))
      return mapUser(data)
    } catch {
      const current = mockUsers.find((user) => user.id === Number(userId))
      if (!current) return null
      const updated: AdminUser = {
        ...current,
        status: current.status === 'active' ? 'banned' : 'active',
      }
      const index = mockUsers.findIndex((user) => user.id === Number(userId))
      mockUsers[index] = updated
      return updated
    }
  },

  async approveListing(listingId: number | string): Promise<AdminListing | null> {
    try {
      const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.admin.verifyProperty(listingId))
      return mapListing(data, false)
    } catch {
      const listing = mockListings.find((item) => item.id === Number(listingId))
      if (!listing) return null
      listing.status = 'approved'
      return { ...listing }
    }
  },

  async rejectListing(listingId: number): Promise<void> {
    try {
      await apiClient.delete<void>(ENDPOINTS.properties.byId(listingId))
    } catch {
      const index = mockListings.findIndex((item) => item.id === listingId)
      if (index >= 0) mockListings.splice(index, 1)
    }
  },

  async deleteListing(listingId: number): Promise<void> {
    try {
      await apiClient.delete<void>(ENDPOINTS.properties.byId(listingId))
    } catch {
      const index = mockListings.findIndex((item) => item.id === listingId)
      if (index >= 0) mockListings.splice(index, 1)
    }
  },

  async cancelBooking(bookingId: number): Promise<AdminBooking | null> {
    try {
      const { data } = await apiClient.patch<BookingResponse>(ENDPOINTS.bookings.updateStatus(bookingId), {
        status: 'CANCELLED',
      })
      return mapBooking(data)
    } catch {
      const booking = mockBookings.find((item) => item.id === bookingId)
      if (!booking) return null
      booking.status = 'cancelled'
      return { ...booking }
    }
  },

  async resolveReport(reportId: number): Promise<AdminReport | null> {
    const mappedTargetId = reportToListingMap.get(reportId)
    if (!mappedTargetId) return null

    if (mappedTargetId > 0) {
      try {
        const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.admin.verifyProperty(mappedTargetId))
        return {
          id: reportId,
          reporter: 'System',
          reason: 'Pending listing approval',
          target: data.title,
          targetType: 'listing',
          resolved: true,
        }
      } catch {
        const report = mockReports.find((item) => item.id === reportId)
        if (!report) return null
        report.resolved = true
        return { ...report }
      }
    }

    const report = mockReports.find((item) => item.id === reportId)
    if (!report) {
      return {
        id: reportId,
        reporter: 'Support',
        reason: 'Abusive behavior report',
        target: `User #${Math.abs(mappedTargetId)}`,
        targetType: 'user',
        resolved: true,
      }
    }

    report.resolved = true
    return { ...report }
  },

  async banUserFromReport(reportId: number): Promise<void> {
    const mappedTargetId = reportToListingMap.get(reportId)
    if (!mappedTargetId || mappedTargetId > 0) return

    const userId = Math.abs(mappedTargetId)

    try {
      await apiClient.put<UserDto>(ENDPOINTS.admin.blockUser(userId))
    } catch {
      const user = mockUsers.find((item) => item.id === userId)
      if (user) user.status = 'banned'
    }
  },

  async getSettings(): Promise<AdminSettings> {
    const { data } = await apiClient.get<AdminSettings>(ENDPOINTS.admin.settings)
    return {
      ...defaultSettings,
      ...(data || {}),
    }
  },

  async saveSettings(nextSettings: AdminSettings): Promise<AdminSettings> {
    const { data } = await apiClient.put<AdminSettings>(ENDPOINTS.admin.settings, nextSettings)
    return {
      ...defaultSettings,
      ...(data || nextSettings),
    }
  },

  async getHostDemands(): Promise<HostDemand[]> {
    return withFallback(async () => {
      const { data } = await apiClient.get<HostDemandApiResponse[]>(ENDPOINTS.admin.hostDemands)
      return data.map(mapHostDemand)
    }, async () => {
      await sleep(300)
      return [...mockHostDemands]
    })
  },

  async getHostDemandById(demandId: number | string): Promise<HostDemand | null> {
    return withFallback(async () => {
      const { data } = await apiClient.get<HostDemandApiResponse>(ENDPOINTS.admin.hostDemandById(demandId))
      return mapHostDemand(data)
    }, async () => {
      const demands = await this.getHostDemands()
      return demands.find((demand) => demand.id === demandId || demand.backendId === String(demandId)) || null
    })
  },

  async approveHostDemand(demandId: number | string): Promise<HostDemand | null> {
    try {
      const { data } = await apiClient.put<HostDemandApiResponse>(ENDPOINTS.admin.approveHostDemand(demandId))
      return mapHostDemand(data)
    } catch {
      const demand = mockHostDemands.find((d) => d.id === demandId || d.backendId === String(demandId))
      if (!demand) return null
      demand.status = 'approved'
      return { ...demand }
    }
  },

  async rejectHostDemand(demandId: number | string, reason?: string): Promise<void> {
    try {
      await apiClient.put(ENDPOINTS.admin.rejectHostDemand(demandId), { reason })
    } catch {
      const demand = mockHostDemands.find((d) => d.id === demandId || d.backendId === String(demandId))
      if (demand) {
        demand.status = 'rejected'
        demand.notes = reason || 'No reason provided'
      }
    }
  },
}

export async function getHostDemands(): Promise<HostDemand[]> {
  return adminApi.getHostDemands()
}

export async function approveHostDemand(demandId: number | string): Promise<HostDemand | null> {
  return adminApi.approveHostDemand(demandId)
}

export async function rejectHostDemand(demandId: number | string, reason?: string): Promise<void> {
  return adminApi.rejectHostDemand(demandId, reason)
}

