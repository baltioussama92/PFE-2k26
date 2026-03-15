import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { authService } from '../services/authService'
import { bookingService } from '../services/bookingService'
import type { BookingResponse, BookingStatus, Role } from '../types/contracts'
import './UserProfile.css'

const BOOKING_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop'

const toStatusClass = (status: BookingStatus): 'upcoming' | 'completed' | 'cancelled' => {
  if (status === 'PENDING') return 'upcoming'
  if (status === 'CONFIRMED') return 'completed'
  return 'cancelled'
}

const toStatusLabel = (status: BookingStatus): string => {
  if (status === 'PENDING') return 'Pending'
  if (status === 'CONFIRMED') return 'Confirmed'
  return 'Cancelled'
}

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const mockSaved = [
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, USA',
    type: 'Cabin',
    price: 120,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
  },
  {
    id: '5',
    title: 'Elegant Victorian Villa',
    location: 'London, UK',
    type: 'Villa',
    price: 320,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e57?w=300&h=200&fit=crop',
  },
]

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'saved'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [role, setRole] = useState<Role>('TENANT')
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError] = useState('')
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop')
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Travel enthusiast and explorer',
    joinDate: 'January 2023',
  })
  const [loading, setLoading] = useState(true)

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser()
        setRole(user.role)
        setProfileData({
          name: user.fullName || 'User',
          email: user.email,
          phone: '+1 (555) 123-4567', // Keep default for now
          bio: 'Travel enthusiast and explorer', // Keep default for now
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
        })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    let active = true

    const fetchBookings = async () => {
      if (role !== 'TENANT' && role !== 'PROPRIETOR') {
        if (active) {
          setBookings([])
          setBookingsLoading(false)
          setBookingsError('')
        }
        return
      }

      if (active) {
        setBookingsLoading(true)
        setBookingsError('')
      }

      try {
        const data = role === 'PROPRIETOR'
          ? await bookingService.getOwnerBookings()
          : await bookingService.getMine()

        if (active) {
          setBookings(data)
        }
      } catch (error) {
        console.error('Failed to load bookings:', error)
        if (active) {
          setBookings([])
          setBookingsError('Could not load bookings right now.')
        }
      } finally {
        if (active) {
          setBookingsLoading(false)
        }
      }
    }

    if (!loading) {
      fetchBookings()
    }

    return () => {
      active = false
    }
  }, [loading, role])

  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setBookingsError('')
    setUpdatingBookingId(bookingId)
    try {
      const updated = await bookingService.updateStatus(bookingId, { status })
      setBookings(prev => prev.map(item => (item.id === bookingId ? updated : item)))
    } catch (error) {
      console.error('Failed to update booking status:', error)
      setBookingsError('Could not update booking status.')
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main">
          <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="header-background"></div>
          <div className="header-content container">
            <div className="profile-avatar">
              <img src={profileImage} alt="Profile" />
              <div className="avatar-overlay" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="avatar-input"
                onChange={handleImageChange}
              />
            </div>
            <div className="header-info">
              <h1>{profileData.name}</h1>
              <p>Member since {profileData.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          <div className="nav-container container">
            <button
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              {role === 'PROPRIETOR' ? 'Booking Requests' : 'My Bookings'}
            </button>
            <button
              className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Properties
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <section className="profile-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                    ></textarea>
                  </div>
                  <button type="button" className="save-button" onClick={() => setIsEditing(false)}>
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <p>{profileData.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{profileData.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{profileData.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Bio</label>
                    <p>{profileData.bio}</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <section className="profile-section">
              <h2>{role === 'PROPRIETOR' ? 'Incoming Booking Requests' : 'My Bookings'}</h2>

              {bookingsError && (
                <div className="empty-state" style={{ marginBottom: '1rem' }}>
                  <p>{bookingsError}</p>
                </div>
              )}

              {bookingsLoading ? (
                <div className="empty-state">
                  <p>Loading bookings...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="bookings-container">
                  {bookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-image">
                        <img src={BOOKING_PLACEHOLDER_IMAGE} alt={`Property ${booking.propertyId}`} />
                        <span className={`booking-status ${toStatusClass(booking.status)}`}>
                          {toStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="booking-details">
                        <h3>Property #{booking.propertyId}</h3>
                        <p className="location">
                          {role === 'PROPRIETOR' ? 'Requested by tenant' : 'Your booking request'}
                        </p>
                        <div className="booking-dates">
                          <span>{formatDate(booking.startDate)}</span>
                          <span>?</span>
                          <span>{formatDate(booking.endDate)}</span>
                        </div>
                        <div className="booking-footer">
                          <span className="price">{toStatusLabel(booking.status)}</span>
                          <div className="booking-actions">
                            <button
                              className="action-button"
                              onClick={() => navigate(`/property/${booking.propertyId}`)}
                            >
                              View Property
                            </button>
                            {role === 'PROPRIETOR' && booking.status === 'PENDING' && (
                              <>
                                <button
                                  className="action-button secondary"
                                  disabled={updatingBookingId === booking.id}
                                  onClick={() => handleUpdateBookingStatus(booking.id as string, 'CONFIRMED')}
                                >
                                  Accept
                                </button>
                                <button
                                  className="action-button secondary"
                                  disabled={updatingBookingId === booking.id}
                                  onClick={() => handleUpdateBookingStatus(booking.id as string, 'CANCELLED')}
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>{role === 'PROPRIETOR' ? 'No booking requests yet' : 'No bookings yet'}</p>
                  <p className="empty-sub">
                    {role === 'PROPRIETOR'
                      ? 'When a tenant books your property, it will appear here.'
                      : 'Start exploring and book your first property!'}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Saved Properties Tab */}
          {activeTab === 'saved' && (
            <section className="profile-section">
              <h2>Saved Properties</h2>

              <div className="saved-grid">
                {mockSaved.map(property => (
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

              {mockSaved.length === 0 && (
                <div className="empty-state">
                  <p>No saved properties</p>
                  <p className="empty-sub">Save your favorite properties to view them later</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UserProfile
