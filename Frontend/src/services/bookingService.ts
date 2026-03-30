import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { BookingRequest, BookingResponse, BookingStatusUpdateRequest } from '../types/contracts'

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

  async updateStatus(id: number | string, payload: BookingStatusUpdateRequest): Promise<BookingResponse> {
    const { data } = await apiClient.patch<BookingResponse>(ENDPOINTS.bookings.updateStatus(id), payload)
    return data
  },
}
