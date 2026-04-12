import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type {
  BookingRequest,
  BookingResponse,
  BookingStatusUpdateRequest,
  CheckInVerificationResponse,
  PaymentCheckoutResponse,
  UnavailableDateRange,
} from '../utils/contracts'

export const bookingService = {
  async create(payload: BookingRequest): Promise<BookingResponse> {
    const { data } = await apiClient.post<BookingResponse>(ENDPOINTS.bookings.create, payload)
    return data
  },

  async getMine(): Promise<BookingResponse[]> {
    const { data } = await apiClient.get<BookingResponse[]>(ENDPOINTS.bookings.listMine)
    return data
  },

  async getOwnerBookings(): Promise<BookingResponse[]> {
    const { data } = await apiClient.get<BookingResponse[]>(ENDPOINTS.bookings.listOwner)
    return data
  },

  async getUnavailableDates(listingId: number | string): Promise<UnavailableDateRange[]> {
    const { data } = await apiClient.get<UnavailableDateRange[]>(ENDPOINTS.bookings.unavailableDates(listingId))
    return data
  },

  async updateStatus(id: number | string, payload: BookingStatusUpdateRequest): Promise<BookingResponse> {
    const { data } = await apiClient.patch<BookingResponse>(ENDPOINTS.bookings.updateStatus(id), payload)
    return data
  },

  async checkoutPayment(bookingId: number | string): Promise<PaymentCheckoutResponse> {
    const { data } = await apiClient.post<PaymentCheckoutResponse>(ENDPOINTS.payments.checkout(bookingId))
    return data
  },

  async verifyCheckIn(bookingId: number | string, secretCode: string): Promise<CheckInVerificationResponse> {
    const { data } = await apiClient.post<CheckInVerificationResponse>(ENDPOINTS.bookings.verifyCheckIn(bookingId), { secretCode })
    return data
  },
}
