import { apiClient } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { buildQueryString } from './query'
import type { PropertyQuery, PropertyRequest, PropertyResponse } from '../types/contracts'
import { DEMO_MODE } from '../config/demo'
import { getMockProperties, getMockPropertyById, MOCK_PROPERTIES } from './mockData'

export const propertyService = {
  async list(query: PropertyQuery = {}): Promise<PropertyResponse[]> {
    // DEMO MODE: Return mock data
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filters = {
        location: query.location,
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      }
      
      return getMockProperties(filters)
    }

    const queryString = buildQueryString(query)
    const { data } = await apiClient.get<PropertyResponse[]>(`${ENDPOINTS.properties.list}${queryString}`)
    return data
  },

  async getById(id: number | string): Promise<PropertyResponse> {
    // DEMO MODE: Return mock data
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const property = getMockPropertyById(id)
      if (!property) {
        throw new Error(`Property with id ${id} not found`)
      }
      return property
    }

    const { data } = await apiClient.get<PropertyResponse>(ENDPOINTS.properties.byId(id))
    return data
  },

  async create(payload: PropertyRequest): Promise<PropertyResponse> {
    // DEMO MODE: Return mock created property
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newProperty: PropertyResponse = {
        id: MOCK_PROPERTIES.length + 1,
        title: payload.title,
        location: payload.location,
        price: payload.pricePerNight,
        ownerId: 1,
      }
      
      return newProperty
    }

    const { data } = await apiClient.post<PropertyResponse>(ENDPOINTS.properties.list, payload)
    return data
  },

  async update(id: number | string, payload: PropertyRequest): Promise<PropertyResponse> {
    // DEMO MODE: Return mock updated property
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const existing = getMockPropertyById(id)
      if (!existing) {
        throw new Error(`Property with id ${id} not found`)
      }
      
      return {
        ...existing,
        ...payload,
      }
    }

    const { data } = await apiClient.put<PropertyResponse>(ENDPOINTS.properties.byId(id), payload)
    return data
  },

  async remove(id: number | string): Promise<void> {
    // DEMO MODE: Simulate deletion
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return
    }

    await apiClient.delete(ENDPOINTS.properties.byId(id))
  },
}
