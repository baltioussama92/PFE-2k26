import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type { ConnectionRequestActionRequest, ConnectionRequestResponse } from '../types/contracts'

export const connectionService = {
  async list(): Promise<ConnectionRequestResponse[]> {
    const { data } = await apiClient.get<ConnectionRequestResponse[]>(ENDPOINTS.connections.list)
    return data
  },

  async listPending(): Promise<ConnectionRequestResponse[]> {
    const { data } = await apiClient.get<ConnectionRequestResponse[]>(ENDPOINTS.connections.pending)
    return data
  },

  async request(payload: ConnectionRequestActionRequest): Promise<ConnectionRequestResponse> {
    const { data } = await apiClient.post<ConnectionRequestResponse>(ENDPOINTS.connections.request, payload)
    return data
  },

  async accept(id: number | string): Promise<ConnectionRequestResponse> {
    const { data } = await apiClient.patch<ConnectionRequestResponse>(ENDPOINTS.connections.accept(id))
    return data
  },
}
