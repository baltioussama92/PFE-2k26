import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PropertyDetails.css'

interface PropertyDetailsData {
  id: string
  title: string
  location: string
  type: string
  price: number
  rating: number
  reviews: number
  images: string[]
  description: string
  amenities: string[]
  bedrooms: number
  bathrooms: number
  guests: number
  hostName: string
  hostImage: string
  hostReviews: number
  reviews_list: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
}

// Mock property data
const mockPropertyDetails: Record<string, PropertyDetailsData> = {
  '1': {
    id: '1',
    title: 'Luxury Modern Apartment',
    location: 'New York, USA',
    type: 'Apartment',
    price: 150,
    rating: 4.8,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    description:
      'Experience luxury living in the heart of New York City. This stunning modern apartment features high ceilings, floor-to-ceiling windows, and premium finishes throughout. Perfect for business travelers or families looking for a sophisticated retreat.',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Washer/Dryer', 'TV', 'Gym Access', 'Doorman', 'Parking'],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    hostName: 'Sarah Johnson',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    hostReviews: 243,
    reviews_list: [
      {
        author: 'Michael Chen',
        rating: 5,
        text: 'Amazing apartment! Location is perfect and the host was very responsive.',
        date: '2 weeks ago',
      },
      {
        author: 'Emma Wilson',
        rating: 4.5,
        text: 'Great space and very clean. Would definitely come back.',
        date: '1 month ago',
      },
      {
        author: 'David Martinez',
        rating: 5,
        text: 'Exceeded my expectations. Everything was perfect!',
        date: '1 month ago',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Beachfront Villa',
    location: 'Bali, Indonesia',
    type: 'Beach House',
    price: 280,
    rating: 4.9,
    reviews: 95,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    ],
    description:
      'Wake up to the sound of waves at this luxurious beachfront villa. Private beach access, infinity pool overlooking the ocean, and world-class amenities make this the ultimate tropical paradise.',
    amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Kitchen', 'Beach Access', 'TV', 'Hot Tub', 'Parking'],
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    hostName: 'Made Bali',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    hostReviews: 189,
    reviews_list: [
      {
        author: 'Jessica Lee',
        rating: 5,
        text: 'Absolute paradise! The views are breathtaking.',
        date: '3 weeks ago',
      },
      {
        author: 'Robert Brown',
        rating: 4.8,
        text: 'Best vacation ever. Everything is luxury!',
        date: '1 month ago',
      },
    ],
  },
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const property = mockPropertyDetails[id || '1'] || mockPropertyDetails['1']

  const [selectedImage, setSelectedImage] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleBooking = () => {
    alert(`Booking ${property.title} from ${checkIn} to ${checkOut} for ${guests} guest(s)`)
  }

  return (
    <div className="property-details-page">
      <Navbar />

      <main className="property-details-main">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={property.images[selectedImage]} alt="Main property view" />
          </div>
          <div className="thumbnail-images">
            {property.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`View ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="property-content">
          {/* Left Section - Details */}
          <div className="left-section">
            <div className="property-header">
              <div>
                <h1>{property.title}</h1>
                <p className="location">{property.location}</p>
              </div>
              <div className="rating-badge">
                <span className="rating-value">⭐ {property.rating}</span>
                <span className="rating-count">({property.reviews} reviews)</span>
              </div>
            </div>

            {/* Property Info Grid */}
            <div className="property-info-grid">
              <div className="info-item">
                <span className="info-label">Bedrooms</span>
                <span className="info-value">{property.bedrooms}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bathrooms</span>
                <span className="info-value">{property.bathrooms}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Guests</span>
                <span className="info-value">Up to {property.guests}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{property.type}</span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>About this property</h2>
              <p>{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Host Info */}
            <div className="host-section">
              <h2>Meet your host</h2>
              <div className="host-info">
                <img src={property.hostImage} alt={property.hostName} className="host-image" />
                <div className="host-details">
                  <h3>{property.hostName}</h3>
                  <p>{property.hostReviews} reviews</p>
                  <button className="contact-button">Contact Host</button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <h2>Reviews ({property.reviews})</h2>
              <div className="reviews-list">
                {property.reviews_list.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <h4>{review.author}</h4>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-rating">{'⭐'.repeat(Math.floor(review.rating))}</div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Booking */}
          <aside className="right-section">
            <div className="booking-sidebar">
              <div className="price-info">
                <span className="price">${property.price}</span>
                <span className="per-night">per night</span>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in</label>
                  <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOut">Check-out</label>
                  <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select id="guests" value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="book-button" onClick={handleBooking}>
                  Book Now
                </button>
              </div>

              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>${property.price} × 3 nights</span>
                  <span>${property.price * 3}</span>
                </div>
                <div className="breakdown-item">
                  <span>Service fee</span>
                  <span>${Math.round(property.price * 3 * 0.1)}</span>
                </div>
                <div className="breakdown-total">
                  <span>Total</span>
                  <span>${Math.round(property.price * 3 * 1.1)}</span>
                </div>
              </div>

              <div className="booking-info">
                <p>✓ Free cancellation</p>
                <p>✓ Secure payment</p>
                <p>✓ Instantly confirmed</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PropertyDetails
