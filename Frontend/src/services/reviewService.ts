import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ReviewRequest, ReviewResponse } from '../types/contracts'

export const reviewService = {
  async create(payload: ReviewRequest): Promise<ReviewResponse> {
    const { data } = await apiClient.post<ReviewResponse>(ENDPOINTS.reviews.create, payload)
    return data
  },

  async listByProperty(propertyId: number | string): Promise<ReviewResponse[]> {
    const { data } = await apiClient.get<ReviewResponse[]>(ENDPOINTS.reviews.listByProperty(propertyId))
    return data
  },
}
