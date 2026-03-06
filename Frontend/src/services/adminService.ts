import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { UpdateUserRoleRequest, UserDto } from '../types/contracts'

export const adminService = {
  async listUsers(): Promise<UserDto[]> {
    const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.admin.users)
    return data
  },

  async updateUserRole(id: number | string, payload: UpdateUserRoleRequest): Promise<UserDto> {
    const { data } = await apiClient.put<UserDto>(ENDPOINTS.admin.updateUserRole(id), payload)
    return data
  },

  async deleteUser(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.deleteUser(id))
  },
}
