import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import './UserProfile.css'

interface Booking {
  id: string
  propertyTitle: string
  location: string
  checkIn: string
  checkOut: string
  status: 'upcoming' | 'completed' | 'cancelled'
  price: number
  image: string
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    propertyTitle: 'Luxury Modern Apartment',
    location: 'New York, USA',
    checkIn: '2024-06-15',
    checkOut: '2024-06-20',
    status: 'upcoming',
    price: 750,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
  },
  {
    id: '2',
    propertyTitle: 'Beachfront Villa',
    location: 'Bali, Indonesia',
    checkIn: '2024-05-10',
    checkOut: '2024-05-20',
    status: 'completed',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop',
  },
]

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
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'saved'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Travel enthusiast and explorer',
    joinDate: 'January 2023',
  })

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="header-background"></div>
          <div className="header-content container">
            <div className="profile-avatar">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop" alt="Profile" />
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
              My Bookings
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
              <h2>My Bookings</h2>

              <div className="bookings-container">
                {mockBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-image">
                      <img src={booking.image} alt={booking.propertyTitle} />
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="booking-details">
                      <h3>{booking.propertyTitle}</h3>
                      <p className="location">{booking.location}</p>
                      <div className="booking-dates">
                        <span>{booking.checkIn}</span>
                        <span>→</span>
                        <span>{booking.checkOut}</span>
                      </div>
                      <div className="booking-footer">
                        <span className="price">${booking.price}</span>
                        <div className="booking-actions">
                          <button className="action-button">View Details</button>
                          {booking.status === 'completed' && (
                            <button className="action-button secondary">Leave Review</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mockBookings.length === 0 && (
                <div className="empty-state">
                  <p>No bookings yet</p>
                  <p className="empty-sub">Start exploring and book your first property!</p>
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
