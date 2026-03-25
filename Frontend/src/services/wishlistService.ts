import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { PropertyResponse } from '../types/contracts'

export const wishlistService = {
  async list(): Promise<PropertyResponse[]> {
    const { data } = await apiClient.get<PropertyResponse[]>(ENDPOINTS.wishlist.list)
    return data
  },

  async add(listingId: number | string): Promise<PropertyResponse[]> {
    const { data } = await apiClient.post<PropertyResponse[]>(ENDPOINTS.wishlist.add(listingId))
    return data
  },

  async remove(listingId: number | string): Promise<PropertyResponse[]> {
    const { data } = await apiClient.delete<PropertyResponse[]>(ENDPOINTS.wishlist.remove(listingId))
    return data
  },
}
