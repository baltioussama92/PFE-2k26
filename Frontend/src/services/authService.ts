import { apiClient, clearStoredAuthToken, setStoredAuthToken } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/contracts'
import { DEMO_MODE, DEMO_CREDENTIALS } from '../config/demo'

const USER_STORAGE_KEY = 'user'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    // DEMO MODE: Return mock auth response
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const demoResponse: AuthResponse = {
        token: DEMO_CREDENTIALS.token,
        role: DEMO_CREDENTIALS.user.role,
        user: DEMO_CREDENTIALS.user,
      }
      
      setStoredAuthToken(demoResponse.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoResponse.user))
      return demoResponse
    }

    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload)
    setStoredAuthToken(data.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    return data
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    // DEMO MODE: Return mock auth response
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const demoResponse: AuthResponse = {
        token: DEMO_CREDENTIALS.token,
        role: payload.role,
        user: {
          ...DEMO_CREDENTIALS.user,
          name: payload.fullName || 'Demo User',
          email: payload.email,
          role: payload.role,
        },
      }
      
      setStoredAuthToken(demoResponse.token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoResponse.user))
      return demoResponse
    }

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
