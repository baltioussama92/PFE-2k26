import React, { useState } from 'react'
import './FilterPanel.css'

interface FilterPanelProps {
  onFilterChange: (filters: any) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [propertyType, setPropertyType] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [rating, setRating] = useState(0)

  const handlePropertyTypeChange = (type: string) => {
    const updated = propertyType.includes(type)
      ? propertyType.filter(t => t !== type)
      : [...propertyType, type]
    setPropertyType(updated)
    onFilterChange({ priceRange, propertyType: updated, amenities, rating })
  }

  const handleAmenitiesChange = (amenity: string) => {
    const updated = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity]
    setAmenities(updated)
    onFilterChange({ priceRange, propertyType, amenities: updated, rating })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setPriceRange([priceRange[0], value])
    onFilterChange({ priceRange: [priceRange[0], value], propertyType, amenities, rating })
  }

  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-input">
          <input type="range" min="0" max="500" value={priceRange[1]} onChange={handlePriceChange} />
          <p>${priceRange[0]} - ${priceRange[1]} / night</p>
        </div>
      </div>

      {/* Property Type */}
      <div className="filter-section">
        <h4>Property Type</h4>
        {['Apartment', 'Villa', 'Cabin', 'Beach House'].map(type => (
          <label key={type} className="checkbox">
            <input
              type="checkbox"
              checked={propertyType.includes(type)}
              onChange={() => handlePropertyTypeChange(type)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Amenities */}
      <div className="filter-section">
        <h4>Amenities</h4>
        {['WiFi', 'Pool', 'Parking', 'Air Conditioning', 'Kitchen', 'Washer'].map(amenity => (
          <label key={amenity} className="checkbox">
            <input
              type="checkbox"
              checked={amenities.includes(amenity)}
              onChange={() => handleAmenitiesChange(amenity)}
            />
            {amenity}
          </label>
        ))}
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h4>Min Rating</h4>
        <div className="rating-select">
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
            <option value="0">Any</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
