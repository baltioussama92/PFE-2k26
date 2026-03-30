import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type { PropertyResponse, UserDto } from '../types/contracts'

export const adminService = {
  async listUsers(): Promise<UserDto[]> {
    const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.admin.users)
    return data
  },

  async blockUser(id: number | string): Promise<UserDto> {
    const { data } = await apiClient.put<UserDto>(ENDPOINTS.admin.blockUser(id))
    return data
  },

  async pendingListings(): Promise<PropertyResponse[]> {
    const { data } = await apiClient.get<PropertyResponse[]>(ENDPOINTS.admin.pendingListings)
    return data
  },

  async verifyProperty(id: number | string): Promise<PropertyResponse> {
    const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.admin.verifyProperty(id))
    return data
  },
}
