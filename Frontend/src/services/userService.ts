import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { UserDto } from '../types/contracts'

export const userService = {
  async search(query: string): Promise<UserDto[]> {
    const { data } = await apiClient.get<UserDto[]>(ENDPOINTS.users.search(query))
    return data
  },
}
