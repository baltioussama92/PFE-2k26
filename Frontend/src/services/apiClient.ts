import axios, { AxiosError } from 'axios'
import type { ApiError, ApiErrorPayload } from '../types/contracts'

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'
const DEFAULT_AUTH_TOKEN_KEY = 'authToken'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY?.trim() || DEFAULT_AUTH_TOKEN_KEY

export const getStoredAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY)

export const setStoredAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearStoredAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

const toApiError = (error: AxiosError<ApiErrorPayload>): ApiError => {
  const status = error.response?.status ?? 500
  const payload = error.response?.data
  const fallbackMessage = payload?.message || payload?.error || error.message || 'Request failed'

  const apiError = new Error(fallbackMessage) as ApiError
  apiError.status = status
  apiError.payload = payload

  return apiError
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken()

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => Promise.reject(toApiError(error)),
)
