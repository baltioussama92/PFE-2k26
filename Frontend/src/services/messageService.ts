import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { MessageRequest, MessageResponse } from '../types/contracts'

export const messageService = {
  async send(payload: MessageRequest): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>(ENDPOINTS.messages.send, payload)
    return data
  },

  async inbox(): Promise<MessageResponse[]> {
    const { data } = await apiClient.get<MessageResponse[]>(ENDPOINTS.messages.inbox)
    return data
  },

  async outbox(): Promise<MessageResponse[]> {
    const { data } = await apiClient.get<MessageResponse[]>(ENDPOINTS.messages.outbox)
    return data
  },
}
