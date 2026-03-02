import React from 'react'
import './Testimonials.css'

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: 'Provide experience',
      author: 'John Doe',
      role: 'Real Estate Agent',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      text: 'The Services Provided are very good and helpful! This organization is very useful,i like the the 27 powered techniques you can see within the house directly without having to go straight in the place',
      author: 'Arya Wignya',
      role: 'UX Designer',
      avatar: '👨‍💼'
    },
    {
      id: 3,
      text: 'An excellent experience with great service and support',
      author: 'Sarah Smith',
      role: 'Home Owner',
      avatar: '👩‍💼'
    }
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What People Say About Us?</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div>
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
