// ── Lightweight HTTP client with JWT injection ──────────────

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const AUTH_TOKEN_KEY = 'authToken'

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

interface ApiResponse<T> {
  data: T
  status: number
}

async function request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/api${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getStoredAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const payload = await res.json()
      if (payload?.message) message = payload.message
    } catch { /* ignore parse errors */ }
    const err: any = new Error(message)
    err.status = res.status
    throw err
  }

  // 204 No Content
  if (res.status === 204) {
    return { data: undefined as unknown as T, status: 204 }
  }

  const data: T = await res.json()
  return { data, status: res.status }
}

export const apiClient = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put:    <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
