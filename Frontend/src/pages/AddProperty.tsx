import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { propertyService } from '../services/propertyService'
import type { ApiError } from '../types/contracts'
import './AddProperty.css'

interface PropertyFormData {
  title: string
  location: string
  description: string
  type: string
  bedrooms: number
  bathrooms: number
  guests: number
  pricePerNight: number
  amenities: string[]
  images: File[]
}

const amenitiesList = ['WiFi', 'Pool', 'Parking', 'Air Conditioning', 'Kitchen', 'Washer/Dryer', 'TV', 'Gym Access']

const AddProperty: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    location: '',
    description: '',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    pricePerNight: 100,
    amenities: [],
    images: [],
  })

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity]
    setFormData(prev => ({ ...prev, amenities: updated }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = event => {
        const result = (event.target as FileReader).result
        if (typeof result === 'string') {
          setSelectedImages(prev => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const created = await propertyService.create({
        title: formData.title.trim(),
        location: formData.location.trim(),
        price: Number(formData.pricePerNight),
      })

      navigate(`/property/${created.id}`)
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 401 || apiError.status === 403) {
        setSubmitError('Only logged-in proprietors can add properties. Please login with a proprietor account.')
      } else {
        setSubmitError(apiError.payload?.message || 'Could not add property right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-property-page">
      <Navbar />

      <main className="add-property-main">
        <div className="form-container">
          <div className="form-header">
            <h1>List Your Property</h1>
            <p>Share your space with travelers around the world</p>
          </div>

          <form onSubmit={handleSubmit} className="property-form">
            {/* Basic Info Section */}
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-group">
                <label htmlFor="title">Property Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Luxury Beachfront Villa"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. Miami, Florida"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your property in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Property Type *</label>
                  <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabin">Cabin</option>
                    <option value="Beach House">Beach House</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="pricePerNight">Price per Night ($) *</label>
                  <input
                    type="number"
                    id="pricePerNight"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Capacity Section */}
            <div className="form-section">
              <h2>Capacity</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bedrooms">Bedrooms *</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bathrooms">Bathrooms *</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Max Guests *</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="form-section">
              <h2>Amenities</h2>

              <div className="amenities-grid">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="form-section">
              <h2>Images</h2>

              <div className="image-upload">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="images" className="upload-label">
                  <span className="upload-icon">📸</span>
                  <span className="upload-text">Click to upload or drag images</span>
                  <span className="upload-sub">PNG, JPG up to 10MB</span>
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="image-preview">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="preview-item">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="form-section submit-section">
              {submitError && (
                <p style={{ color: '#b91c1c', marginBottom: 12 }}>{submitError}</p>
              )}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Listing...' : 'List Your Property'}
              </button>
              <button type="button" className="cancel-button" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AddProperty
