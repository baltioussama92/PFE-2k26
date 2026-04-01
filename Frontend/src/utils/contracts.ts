// ── TypeScript contracts matching backend DTOs ──────────────

// ── Roles ────────────────────────────────────────────────────
export type BackendRole = 'ADMIN' | 'HOST' | 'GUEST'
export type FrontendRole = 'ADMIN' | 'PROPRIETOR' | 'TENANT'

export const mapBackendRole = (role: string | undefined): FrontendRole => {
  if (role === 'HOST') return 'PROPRIETOR'
  if (role === 'GUEST') return 'TENANT'
  if (role === 'ADMIN') return 'ADMIN'
  return 'TENANT'
}

export const mapFrontendRole = (role: string | undefined): BackendRole => {
  if (role === 'PROPRIETOR') return 'HOST'
  if (role === 'TENANT') return 'GUEST'
  if (role === 'ADMIN') return 'ADMIN'
  return 'GUEST'
}

// ── Auth ─────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role: BackendRole
}

export type VerificationStatus = 'not_verified' | 'pending' | 'approved' | 'rejected'

export interface GuestVerificationSummary {
  emailVerified: boolean
  phoneVerified: boolean
  identityStatus: VerificationStatus
  verificationLevel: 0 | 1 | 2 | 3
  rejectionReason?: string
}

export interface UserDto {
  id: string | number
  fullName?: string
  name?: string
  email: string
  role: string
  createdAt?: string
  isVerified?: boolean
  banned?: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
  identityStatus?: VerificationStatus
  verificationLevel?: 0 | 1 | 2 | 3
  // frontend-only extras
  username?: string
  bio?: string
  avatar?: string
}

export interface AuthResponse {
  token: string
  role: string
  user: UserDto
}

// ── Properties ───────────────────────────────────────────────
export interface PropertyRequest {
  title: string
  description: string
  location: string
  pricePerNight: number
  images?: string[]
}

export interface PropertyResponse {
  id: string | number
  title: string
  description?: string
  location: string
  pricePerNight?: number
  price?: number
  images?: string[]
  hostId?: string
  createdAt?: string
  // frontend-enriched fields (not from backend)
  ownerId?: number
  image?: string
  currency?: string
  period?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  rating?: number
  reviewCount?: number
  type?: string
  badge?: string
  badgeColor?: string
  available?: boolean
  amenities?: string[]
  host?: { name: string; avatar: string }
  lat?: number
  lng?: number
}

export interface PropertyQuery {
  location?: string
  minPrice?: number | string
  maxPrice?: number | string
  available?: boolean
}

// ── Bookings ─────────────────────────────────────────────────
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED'

export interface BookingRequest {
  listingId: string
  checkInDate: string
  checkOutDate: string
}

export interface BookingResponse {
  id: string
  listingId: string
  guestId: string
  checkInDate: string
  checkOutDate: string
  status: BookingStatus
  guests?: number
  totalPrice?: number
  createdAt?: string
  listingTitle?: string
  listingLocation?: string
  listingImage?: string
}

export interface BookingStatusUpdateRequest {
  status: BookingStatus
}

// ── Reviews ──────────────────────────────────────────────────
export interface ReviewRequest {
  listingId: string
  rating: number
  comment?: string
}

export interface ReviewResponse {
  id: string
  rating: number
  comment: string
  guestId: string
  listingId: string
  createdAt: string
}

// ── Messages ─────────────────────────────────────────────────
export interface MessageRequest {
  receiverId: string | number
  content: string
}

export interface MessageResponse {
  id: string
  senderId: string | number
  receiverId: string | number
  content: string
  createdAt: string
}

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface ConnectionRequestActionRequest {
  targetUserId: string
}

export interface ConnectionRequestResponse {
  id: string
  requesterId: string
  receiverId: string
  status: ConnectionStatus
  createdAt?: string
  respondedAt?: string
}

// ── Admin ────────────────────────────────────────────────────
export interface UpdateUserProfileRequest {
  fullName: string
}

// ── API error shape ──────────────────────────────────────────
export interface ApiError {
  status: number
  message?: string
  payload?: { message?: string }
}
