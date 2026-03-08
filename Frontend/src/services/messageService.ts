import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { MessageRequest, MessageResponse } from '../types/contracts'
import { DEMO_MODE } from '../config/demo'

const DEMO_MESSAGES_KEY = 'demoMessages'

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const getCurrentUserId = (): number | string => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return 1
    const parsed = JSON.parse(raw) as { id?: number | string }
    return parsed.id ?? 1
  } catch {
    return 1
  }
}

const sameId = (left: number | string, right: number | string): boolean => String(left) === String(right)

const defaultDemoMessages: MessageResponse[] = [
  {
    id: 'm-1',
    senderId: 2,
    receiverId: 1,
    content: 'Hi, is your property still available for next weekend?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'm-2',
    senderId: 1,
    receiverId: 2,
    content: 'Yes, it is available. You can book directly from the listing page.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'm-3',
    senderId: 3,
    receiverId: 1,
    content: 'Could we check in a bit earlier on Friday?',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
]

const readDemoMessages = (): MessageResponse[] => {
  try {
    const raw = localStorage.getItem(DEMO_MESSAGES_KEY)
    if (!raw) {
      localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(defaultDemoMessages))
      return [...defaultDemoMessages]
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as MessageResponse[] : [...defaultDemoMessages]
  } catch {
    return [...defaultDemoMessages]
  }
}

const writeDemoMessages = (messages: MessageResponse[]): void => {
  localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages))
}

export const messageService = {
  async send(payload: MessageRequest): Promise<MessageResponse> {
    if (DEMO_MODE) {
      await sleep(220)

      const messages = readDemoMessages()
      const sentMessage: MessageResponse = {
        id: `m-${Date.now()}`,
        senderId: getCurrentUserId(),
        receiverId: payload.receiverId,
        content: payload.content,
        createdAt: new Date().toISOString(),
      }

      messages.push(sentMessage)
      writeDemoMessages(messages)
      return sentMessage
    }

    const { data } = await apiClient.post<MessageResponse>(ENDPOINTS.messages.send, payload)
    return data
  },

  async inbox(): Promise<MessageResponse[]> {
    if (DEMO_MODE) {
      await sleep(160)

      const currentUserId = getCurrentUserId()
      return readDemoMessages().filter((message) => sameId(message.receiverId, currentUserId))
    }

    const { data } = await apiClient.get<MessageResponse[]>(ENDPOINTS.messages.inbox)
    return data
  },

  async outbox(): Promise<MessageResponse[]> {
    if (DEMO_MODE) {
      await sleep(160)

      const currentUserId = getCurrentUserId()
      return readDemoMessages().filter((message) => sameId(message.senderId, currentUserId))
    }

    const { data } = await apiClient.get<MessageResponse[]>(ENDPOINTS.messages.outbox)
    return data
  },
}
