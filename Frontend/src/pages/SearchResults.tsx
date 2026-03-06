import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import FilterPanel from '../components/FilterPanel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SearchResults.css'

// Mock property data
const mockProperties: any[] = []

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('recommended')
  const [filters, setFilters] = useState({
    priceRange: [0, 500] as [number, number],
    propertyType: [] as string[],
    amenities: [] as string[],
    rating: 0,
  })

  const location = searchParams.get('location') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = searchParams.get('guests') || ''

  // Filter and sort properties
  let filteredProperties = mockProperties.filter(prop => {
    const matchesPrice = prop.price >= filters.priceRange[0] && prop.price <= filters.priceRange[1]
    const matchesType = filters.propertyType.length === 0 || filters.propertyType.includes(prop.type)
    const matchesRating = prop.rating >= filters.rating
    return matchesPrice && matchesType && matchesRating
  })

  if (sortBy === 'price-low') {
    filteredProperties.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProperties.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProperties.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="search-results-page">
      <Navbar />

      <main className="search-results-main">
        <div className="search-criteria">
          <div className="criteria-info">
            <h1>
              {location ? `Results for ${location}` : 'All Properties'}
            </h1>
            <p className="criteria-details">
              {checkIn && checkOut && `${checkIn} to ${checkOut}`}
              {guests && ` • ${guests} guest${guests !== '1' ? 's' : ''}`}
            </p>
          </div>

          <div className="sort-control">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="results-container">
          <FilterPanel onFilterChange={setFilters} />

          <div className="properties-section">
            <div className="properties-count">
              {filteredProperties.length} properties found
            </div>
            <div className="properties-grid">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  rating={property.rating}
                  image={property.image}
                  type={property.type}
                />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="no-results">
                <p>Sorry, no houses yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SearchResults
