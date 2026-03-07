import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SkeletonLoader from '../components/SkeletonLoader'
import { propertyService } from '../services/propertyService'
import { bookingService } from '../services/bookingService'
import type { ApiError, PropertyResponse } from '../types/contracts'
import './PropertyDetails.css'

interface PropertyDetailsData {
  id: string | number
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

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
]

const mapToPropertyDetails = (property: PropertyResponse): PropertyDetailsData => ({
  id: property.id,
  title: property.title,
  location: property.location,
  type: 'Property',
  price: Number(property.price ?? 0),
  rating: 4.6,
  reviews: 0,
  images: GALLERY_IMAGES,
  description: 'Comfortable stay in a well-located property with essential amenities for a pleasant booking experience.',
  amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Parking'],
  bedrooms: 2,
  bathrooms: 1,
  guests: 4,
  hostName: 'Maskan Host',
  hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  hostReviews: 0,
  reviews_list: [],
})

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<PropertyDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedImage, setSelectedImage] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    let active = true

    const loadProperty = async () => {
      if (!id) {
        setError('Property Not Found')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await propertyService.getById(id)
        if (!active) {
          return
        }
        setProperty(mapToPropertyDetails(data))
      } catch {
        if (!active) {
          return
        }
        setError('Server Connection Error')
        setProperty(null)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProperty()
    return () => {
      active = false
    }
  }, [id])

  const handleBooking = async () => {
    if (!property) {
      return
    }

    if (!checkIn || !checkOut) {
      setBookingMessage('Please select check-in and check-out dates.')
      return
    }

    if (new Date(checkOut) < new Date(checkIn)) {
      setBookingMessage('Check-out date must be after check-in date.')
      return
    }

    setBookingLoading(true)
    setBookingMessage('')

    try {
      await bookingService.create({
        propertyId: property.id,
        startDate: checkIn,
        endDate: checkOut,
      })
      setBookingMessage('Booking created successfully.')
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 401 || apiError.status === 403) {
        setBookingMessage('Please sign in as a tenant to create a booking.')
      } else {
        setBookingMessage('Server Connection Error')
      }
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="property-details-page">
        <Navbar />
        <main className="property-details-main">
          <SkeletonLoader count={3} />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="property-details-page">
        <Navbar />
        <main className="property-details-main">
          <div className="no-results">
            <p>{error || 'Property Not Found'}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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

                <button className="book-button" onClick={handleBooking} disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>

                {bookingMessage && (
                  <p className="review-date" style={{ marginTop: '10px' }}>{bookingMessage}</p>
                )}
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
