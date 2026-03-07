import { useEffect, useMemo, useState } from 'react'
import { propertyService } from '../services/propertyService'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'

const normalizeListing = (property) => ({
  id: property.id,
  title: property.title,
  location: property.location,
  price: Number(property.price ?? 0),
  rating: 4.5,
  reviewCount: 0,
  image: FALLBACK_IMAGE,
  type: 'Property',
  instantBooking: true,
})

export const usePropertyListings = ({ sortBy = 'recommended', filters }) => {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const loadListings = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await propertyService.list()
        if (!isActive) return

        const normalizedListings = Array.isArray(response)
          ? response.map(normalizeListing)
          : []

        setListings(normalizedListings)
      } catch {
        if (!isActive) return
        setErrorMessage('Server Connection Error')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadListings()

    return () => {
      isActive = false
    }
  }, [])

  const filteredListings = useMemo(() => {
    const activeFilters = filters || {
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      propertyType: [],
      rating: 0,
    }

    const matchedListings = listings.filter((property) => {
      const withinPriceRange =
        property.price >= activeFilters.priceRange[0] &&
        property.price <= activeFilters.priceRange[1]
      const matchesType =
        activeFilters.propertyType.length === 0 ||
        activeFilters.propertyType.includes(property.type)
      const meetsRating = property.rating >= activeFilters.rating

      return withinPriceRange && matchesType && meetsRating
    })

    if (sortBy === 'price-low') {
      matchedListings.sort((left, right) => left.price - right.price)
    } else if (sortBy === 'price-high') {
      matchedListings.sort((left, right) => right.price - left.price)
    } else if (sortBy === 'rating') {
      matchedListings.sort((left, right) => right.rating - left.rating)
    }

    return matchedListings
  }, [filters, listings, sortBy])

  return {
    listings: filteredListings,
    isLoading,
    errorMessage,
  }
}
