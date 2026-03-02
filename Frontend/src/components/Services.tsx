import React from 'react'
import './Services.css'

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      icon: '👁️',
      title: '3D Viewer',
      description: 'You can catch a glimpse of the 3D viewer features before you view each the house and property directly'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Choose your type',
      description: 'Find your dream and lovely home, lock your dream house and you can chose the location'
    },
    {
      id: 3,
      icon: '💳',
      title: 'Easy Payment',
      description: 'After you added the property and house want it now you can make payments with various option'
    }
  ]

  return (
    <section className="services">
      <div className="container">
        <div className="section-header">
          <p className="section-label">— What We Serve —</p>
          <h2 className="section-title">The Benefit Form Our Service</h2>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
