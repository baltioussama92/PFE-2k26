import { apiClient } from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'

export type NotificationType = 'BOOKING' | 'SYSTEM' | 'ALERT'

export interface NotificationItem {
  id: string
  recipientId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export const notificationService = {
  async listMine(): Promise<NotificationItem[]> {
    const { data } = await apiClient.get<NotificationItem[]>(ENDPOINTS.notifications.me)
    return data
  },

  async markAsRead(notificationId: string): Promise<NotificationItem> {
    const { data } = await apiClient.patch<NotificationItem>(ENDPOINTS.notifications.markRead(notificationId))
    return data
  },

  async markAllAsRead(): Promise<{ updated: number }> {
    const { data } = await apiClient.patch<{ updated: number }>(ENDPOINTS.notifications.markAllRead)
    return data
  },
}
