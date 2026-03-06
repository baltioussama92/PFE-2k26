import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [pets, setPets] = useState(0)

  const incrementAdults = () => setAdults(Math.min(adults + 1, 6))
  const decrementAdults = () => setAdults(Math.max(adults - 1, 1))
  const incrementKids = () => setKids(Math.min(kids + 1, 4))
  const decrementKids = () => setKids(Math.max(kids - 1, 0))
  const incrementPets = () => setPets(Math.min(pets + 1, 3))
  const decrementPets = () => setPets(Math.max(pets - 1, 0))

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.append('location', location)
    if (checkIn) params.append('checkIn', checkIn)
    if (checkOut) params.append('checkOut', checkOut)
    if (adults) params.append('adults', String(adults))
    if (kids) params.append('kids', String(kids))
    if (pets) params.append('pets', String(pets))
    navigate(`/search?${params.toString()}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-bar">
      <div className="search-container">
        <div className="search-row search-row-top">
          <div className="search-field top-field">
            <label>Location</label>
            <input
              type="text"
              placeholder="City, area..."
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="search-divider" />

          <div className="search-field top-field">
            <label>Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="search-divider" />

          <div className="search-field top-field">
            <label>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="search-row search-row-bottom">
          <div className="search-field guest-field">
            <div className="counter-block">
              <span className="counter-label">Adults</span>
              <button className="counter-btn" onClick={decrementAdults}>−</button>
              <span className="counter-value">{adults}</span>
              <button className="counter-btn" onClick={incrementAdults}>+</button>
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field guest-field">
            <div className="counter-block">
              <span className="counter-label">Kids</span>
              <button className="counter-btn" onClick={decrementKids}>−</button>
              <span className="counter-value">{kids}</span>
              <button className="counter-btn" onClick={incrementKids}>+</button>
            </div>
          </div>

          <div className="search-divider" />

          <div className="search-field guest-field">
            <div className="counter-block">
              <span className="counter-label">Pets</span>
              <button className="counter-btn" onClick={decrementPets}>−</button>
              <span className="counter-value">{pets}</span>
              <button className="counter-btn" onClick={incrementPets}>+</button>
            </div>
          </div>
        </div>

        <div className="search-row search-row-actions">
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
