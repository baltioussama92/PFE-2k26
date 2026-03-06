import { apiClient, clearStoredAuthToken, setStoredAuthToken } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/contracts'

const USER_STORAGE_KEY = 'user'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload)
    setStoredAuthToken(data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    return data
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.auth.register, payload)
    setStoredAuthToken(data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    return data
  },

  logout(): void {
    clearStoredAuthToken()
    localStorage.removeItem(USER_STORAGE_KEY)
  },
}
