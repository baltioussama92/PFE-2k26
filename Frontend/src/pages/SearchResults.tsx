import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel'
import PropertyGrid from '../components/PropertyGrid'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SearchResults.css'

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
              Live properties from backend
            </div>
            <PropertyGrid sortBy={sortBy} filters={filters} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SearchResults
