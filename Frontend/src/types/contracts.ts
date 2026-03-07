export type Role = 'ADMIN' | 'OWNER' | 'TENANT'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface UserDto {
  id: number | string
  name: string
  email: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: Role
}

export interface AuthResponse {
  token: string
  role: Role
  user: UserDto
}

export interface PropertyRequest {
  title: string
  location: string
  price: number
}

export interface PropertyResponse {
  id: number | string
  title: string
  location: string
  price: number
  ownerId: number | string
}

export interface PropertyQuery {
  location?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  kids?: number
  pets?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export interface BookingRequest {
  propertyId: number | string
  startDate: string
  endDate: string
}

export interface BookingStatusUpdateRequest {
  status: BookingStatus
}

export interface BookingResponse {
  id: number | string
  startDate: string
  endDate: string
  status: BookingStatus
  propertyId: number | string
  userId: number | string
}

export interface ReviewRequest {
  propertyId: number | string
  rating: number
  comment?: string
}

export interface ReviewResponse {
  id: number | string
  rating: number
  comment: string
  userId: number | string
  propertyId: number | string
}

export interface MessageRequest {
  receiverId: number | string
  content: string
}

export interface MessageResponse {
  id: number | string
  senderId: number | string
  receiverId: number | string
  content: string
  createdAt: string
}

export interface UpdateUserRoleRequest {
  role: Role
}

export interface ApiErrorPayload {
  message?: string
  error?: string
  details?: unknown
}

export interface ApiError extends Error {
  status: number
  payload?: ApiErrorPayload
}
