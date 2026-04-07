import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Heart, Star, MapPin, DollarSign, Check, Clock, X } from 'lucide-react'

// Booking Overview Section
function BookingOverviewSection({ bookings = [] }) {
  const upcomingBookings = bookings.filter(b => new Date(b.checkIn) > new Date())
  const pastBookings = bookings.filter(b => new Date(b.checkOut) <= new Date())
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Your Bookings</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Upcoming</p>
          <p className="text-2xl font-bold text-blue-700">{upcomingBookings.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">Completed</p>
          <p className="text-2xl font-bold text-emerald-700">{pastBookings.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 uppercase mb-2">Cancelled</p>
          <p className="text-2xl font-bold text-red-700">{cancelledBookings.length}</p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No bookings yet. Start exploring properties!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {bookings.slice(0, 5).map((booking, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-300 transition-colors"
            >
              {booking.propertyImage && (
                <img
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{booking.propertyTitle}</h4>
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {booking.location}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </span>
                  {booking.status === 'completed' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <Check className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {booking.status === 'upcoming' && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      Upcoming
                    </span>
                  )}
                  {booking.status === 'cancelled' && (
                    <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      <X className="w-3 h-3" />
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {booking.totalPrice}
                </p>
              </div>
            </motion.div>
          ))}
          {bookings.length > 5 && (
            <p className="text-center text-sm text-slate-500 pt-2">+{bookings.length - 5} more bookings</p>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Reviews Section
function ReviewsSection({ reviews = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Reviews from Hosts</h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No reviews yet. Complete your first stay!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{review.hostName}</h4>
                  <p className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 italic">"{review.comment}"</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Wishlist/Favorites Section
function WishlistSection({ wishlist = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Saved Properties</h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No saved properties yet. Keep exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow bg-white group cursor-pointer"
            >
              {property.image && (
                <div className="relative h-40 overflow-hidden bg-slate-200">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-slate-900 truncate">{property.title}</h4>
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {property.location}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-bold text-slate-900">${property.price}/night</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">{property.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Main GuestView Component
export default function GuestView({ user, bookings = [], reviews = [], wishlist = [] }) {
  return (
    <div className="space-y-6">
      <BookingOverviewSection bookings={bookings} />
      <ReviewsSection reviews={reviews} />
      <WishlistSection wishlist={wishlist} />
    </div>
  )
}
