import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type { UserDto } from '../types/contracts'

export const userService = {
  async search(query: string): Promise<UserDto[]> {
    const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.users.search(query))
    return data
  },
}
