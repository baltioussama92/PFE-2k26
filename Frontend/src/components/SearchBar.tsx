import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar: React.FC = () => {
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('Modern House')
  const [priceRange, setPriceRange] = useState('$9800 - $30000')

  const handleSearch = () => {
    console.log({ location, propertyType, priceRange })
  }

  return (
    <div className="search-bar">
      <div className="search-container">
        <div className="search-field">
          <label>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select location</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
            <option value="houston">Houston</option>
          </select>
        </div>

        <div className="search-field">
          <label>Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="Modern House">Modern House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Condo">Condo</option>
          </select>
        </div>

        <div className="search-field">
          <label>Average Price</label>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="$9800 - $30000">$9800 - $30000</option>
            <option value="$30000 - $50000">$30000 - $50000</option>
            <option value="$50000 - $100000">$50000 - $100000</option>
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>
    </div>
  )
}

export default SearchBar
