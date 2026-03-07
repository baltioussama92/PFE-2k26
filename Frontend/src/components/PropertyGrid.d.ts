import type { FC } from 'react'

interface PropertyGridFilters {
  priceRange: [number, number]
  propertyType: string[]
  amenities: string[]
  rating: number
}

interface PropertyGridProps {
  sortBy?: string
  filters: PropertyGridFilters
}

declare const PropertyGrid: FC<PropertyGridProps>

export default PropertyGrid
