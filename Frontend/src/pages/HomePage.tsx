import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import Footer from '../components/Footer'
import './HomePage.css'

// Featured properties mock data
const featuredProperties: any[] = []

const categories = [
  {
    type: 'Apartment',
    icon: '🏢',
    description: 'Urban living spaces',
  },
  {
    type: 'Villa',
    icon: '🏡',
    description: 'Luxury villas with style',
  },
  {
    type: 'Cabin',
    icon: '🏕️',
    description: 'Cozy mountain retreats',
  },
  {
    type: 'Beach House',
    icon: '🏖️',
    description: 'Seaside paradise',
  },
]

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1>Plan Your Escape</h1>
          <p>Luxury homes for calm and unforgettable stays.</p>
          <div className="hero-tags">
            <span>Mountain Retreat</span>
            <span>Cozy Cottage</span>
          </div>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* About House Section */}
      <section id="about-house" className="about-section">
        <div className="container">
          <div className="about-header">
            <h2>About Maskan</h2>
            <p>We connect hosts with clients, creating meaningful connections between property owners and travelers seeking authentic experiences.</p>
          </div>

          <div className="about-grid">
            <article className="about-card">
              <img
                src="../../public/hosts.webp"
                alt="Hosts welcoming guests"
              />
              <div className="about-card-body">
                <h3>For Hosts</h3>
                <p>List your property, reach travelers worldwide, and earn income by sharing your space with guests who care.</p>
              </div>
            </article>

            <article className="about-card">
              <img
                src="../../public/guest.jpg"
                alt="Guests exploring properties"
              />
              <div className="about-card-body">
                <h3>For Guests</h3>
                <p>Discover unique properties, book with confidence, and create unforgettable memories in homes that feel like yours.</p>
              </div>
            </article>

            <article className="about-review">
              <p className="review-text">"Maskan made it easy to find the perfect home away from home. Highly recommended!"</p>
              <p className="review-author">— A Happy Guest</p>
              <Link to="/search" className="gallery-button">Start Exploring</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Properties</h2>
          <p className="section-subtitle">Explore our most popular listings</p>

          <div className="properties-grid">
            {featuredProperties.length > 0 ? (
              featuredProperties.map(property => (
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
              ))
            ) : (
              <div className="no-properties-message">
                <p>Sorry, no houses yet</p>
              </div>
            )}
          </div>

          <div className="view-all">
            <Link to="/search" className="view-all-button">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Property Information Section */}
      <section className="info-section">
        <div className="container">
          <h2>Property Information</h2>
          <div className="info-grid">
            <article className="info-card">
              <h3>Description</h3>
              <p>Spacious living areas, natural daylight, and curated decor for a relaxing stay.</p>
            </article>
            <article className="info-card">
              <h3>Amenities</h3>
              <p>Private pool, modern kitchen, high-speed Wi-Fi, premium bedding, and secure parking.</p>
            </article>
            <article className="info-card info-stat">
              <span>Rooms</span>
              <strong>6</strong>
            </article>
            <article className="info-card info-stat">
              <span>Year Built</span>
              <strong>2023</strong>
            </article>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <p className="section-subtitle">Find your ideal accommodation type</p>

          <div className="categories-grid">
            {categories.map(category => (
              <Link key={category.type} to={`/search?type=${category.type}`} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.type}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="cta-content">
          <h2>Become a Host</h2>
          <p>Earn money by renting out your space on Maskan</p>
          <Link to="/add-property" className="cta-button">
            List Your Property
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
