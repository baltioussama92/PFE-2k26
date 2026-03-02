import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import './HomePage.css'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <SearchBar />
      <Services />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default HomePage
