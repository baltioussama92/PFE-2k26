import React, { useEffect, useMemo, useState } from 'react'
import PropertyCard from './PropertyCard'
import SkeletonLoader from './SkeletonLoader'
import { fetchProperties } from '../services/PropertyService'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'

const toUiProperty = (property) => ({
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

const PropertyGrid = ({ sortBy = 'recommended', filters }) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchProperties()
        if (!active) return
        setProperties(Array.isArray(data) ? data.map(toUiProperty) : [])
      } catch {
        if (!active) return
        setError('Server Connection Error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const visibleProperties = useMemo(() => {
    const safeFilters = filters || {
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      propertyType: [],
      rating: 0,
    }

    const result = properties.filter((prop) => {
      const matchesPrice = prop.price >= safeFilters.priceRange[0] && prop.price <= safeFilters.priceRange[1]
      const matchesType = safeFilters.propertyType.length === 0 || safeFilters.propertyType.includes(prop.type)
      const matchesRating = prop.rating >= safeFilters.rating
      return matchesPrice && matchesType && matchesRating
    })

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [filters, properties, sortBy])

  if (loading) {
    return <SkeletonLoader count={6} />
  }

  if (error) {
    return (
      <div className="no-results">
        <p>{error}</p>
      </div>
    )
  }

  if (visibleProperties.length === 0) {
    return (
      <div className="no-results">
        <p>Sorry, no houses yet</p>
      </div>
    )
  }

  return (
    <div className="properties-grid">
      {visibleProperties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={property.location}
          price={property.price}
          rating={property.rating}
          reviewCount={property.reviewCount}
          image={property.image}
          type={property.type}
          instantBooking={property.instantBooking}
        />
      ))}
    </div>
  )
}

export default PropertyGrid
