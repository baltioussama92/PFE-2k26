import type { PropertyResponse } from '../utils/contracts'

export const MOCK_PROPERTIES: PropertyResponse[] = [
  {
    id: 1,
    title: 'Luxury Villa with Ocean View',
    location: 'Casablanca, Morocco',
    price: 450,
    ownerId: 1,
  },
  {
    id: 2,
    title: 'Cozy Mountain Cabin',
    location: 'Ifrane, Morocco',
    price: 180,
    ownerId: 2,
  },
  {
    id: 3,
    title: 'Modern City Apartment',
    location: 'Rabat, Morocco',
    price: 120,
    ownerId: 1,
  },
  {
    id: 4,
    title: 'Beachfront Bungalow',
    location: 'Essaouira, Morocco',
    price: 280,
    ownerId: 3,
  },
  {
    id: 5,
    title: 'Desert Eco Lodge',
    location: 'Merzouga, Morocco',
    price: 220,
    ownerId: 2,
  },
  {
    id: 6,
    title: 'Historic Riad in Medina',
    location: 'Marrakech, Morocco',
    price: 350,
    ownerId: 3,
  },
]

export const getMockProperties = (filters?: { location?: string; maxPrice?: number }): PropertyResponse[] => {
  let filtered = [...MOCK_PROPERTIES]

  if (filters?.location) {
    const searchTerm = filters.location.toLowerCase()
    filtered = filtered.filter(p => p.location.toLowerCase().includes(searchTerm))
  }

  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
  }

  return filtered
}

export const getMockPropertyById = (id: number | string): PropertyResponse | undefined => {
  return MOCK_PROPERTIES.find(p => p.id === Number(id))
}
