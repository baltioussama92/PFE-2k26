import React from 'react'
import { Link } from 'react-router-dom'
import './PropertyCard.css'

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  rating: number
  image: string
  type: string
}

const PropertyCard: React.FC<PropertyCardProps> = ({ id, title, location, price, rating, image, type }) => {
  return (
    <Link to={`/property/${id}`} className="property-card">
      <div className="property-image">
        <img src={image} alt={title} />
        <span className="property-type">{type}</span>
      </div>
      <div className="property-info">
        <div className="property-header">
          <h3 className="property-title">{title}</h3>
          <span className="property-rating">⭐ {rating}</span>
        </div>
        <p className="property-location">📍 {location}</p>
        <div className="property-footer">
          <span className="property-price">${price}<span className="night">/night</span></span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
