import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import type { MessageRequest, MessageResponse } from '../utils/contracts'
import { DEMO_MODE } from '../data/demo'

export interface ConversationSummary {
  userId: string
  lastMessage?: string
  lastMessageAt?: string
}

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

  async conversations(): Promise<ConversationSummary[]> {
    const { data } = await apiClient.get<ConversationSummary[]>(ENDPOINTS.messages.conversations)
    return data
  },

  async conversation(userId: number | string): Promise<MessageResponse[]> {
    const { data } = await apiClient.get<MessageResponse[]>(ENDPOINTS.messages.conversation(userId))
    return data
  },
}
