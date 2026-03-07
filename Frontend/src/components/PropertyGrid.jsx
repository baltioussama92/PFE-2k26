import React from 'react'
import PropertyCard from './PropertyCard'
import SkeletonLoader from './SkeletonLoader'
import { usePropertyListings } from '../hooks/usePropertyListings'

const PropertyGrid = ({ sortBy = 'recommended', filters }) => {
  const { listings, isLoading, errorMessage } = usePropertyListings({ sortBy, filters })

  if (isLoading) {
    return <SkeletonLoader count={6} />
  }

  if (errorMessage) {
    return (
      <div className="no-results">
        <p>{errorMessage}</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="no-results">
        <p>Sorry, no houses yet</p>
      </div>
    )
  }

  return (
    <div className="properties-grid">
      {listings.map((property) => (
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
