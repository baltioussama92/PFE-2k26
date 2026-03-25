import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { buildQueryString } from './query'
import type { PropertyQuery, PropertyRequest, PropertyResponse } from '../types/contracts'

export const propertyService = {
  async list(query: PropertyQuery = {}): Promise<PropertyResponse[]> {
    const queryString = buildQueryString(query)
    const { data } = await apiClient.get<PropertyResponse[]>(`${ENDPOINTS.properties.list}${queryString}`)
    return data
  },

  async listMine(): Promise<PropertyResponse[]> {
    const { data } = await apiClient.get<PropertyResponse[]>(ENDPOINTS.properties.mine)
    return data
  },

  async getById(id: number | string): Promise<PropertyResponse> {
    const { data } = await apiClient.get<PropertyResponse>(ENDPOINTS.properties.byId(id))
    return data
  },

  async create(payload: PropertyRequest): Promise<PropertyResponse> {
    const { data } = await apiClient.post<PropertyResponse>(ENDPOINTS.properties.list, payload)
    return data
  },

  async update(id: number | string, payload: PropertyRequest): Promise<PropertyResponse> {
    const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.properties.byId(id), payload)
    return data
  },

  async remove(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.properties.byId(id))
  },
}
