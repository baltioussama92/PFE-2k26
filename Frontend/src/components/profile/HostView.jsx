import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Home, Calendar, TrendingUp, MessageSquare, Star, Plus, Eye,
  Edit, Trash2, DollarSign, Users, Clock, CheckCircle, MapPin,
  Zap, Award
} from 'lucide-react'

// Dashboard Summary Section
function DashboardSummary({ stats = {} }) {
  const {
    totalListings = 0,
    totalBookings = 0,
    responseRate = 0,
    acceptanceRate = 0,
    totalEarnings = 0,
    monthlyEarnings = 0,
    averageRating = 4.8,
  } = stats

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Host Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Listings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-600 uppercase">Listings</span>
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalListings}</p>
        </motion.div>

        {/* Total Bookings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase">Bookings</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{totalBookings}</p>
        </motion.div>

        {/* Response Rate */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-600 uppercase">Response</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">{responseRate}%</p>
        </motion.div>

        {/* Acceptance Rate */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-600 uppercase">Acceptance</span>
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{acceptanceRate}%</p>
        </motion.div>

        {/* Total Earnings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-green-600 uppercase">Total</span>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">${totalEarnings}k</p>
        </motion.div>

        {/* Monthly Earnings */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-red-600 uppercase">This Month</span>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">${monthlyEarnings}</p>
        </motion.div>
      </div>

      {/* Rating Display */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="font-semibold text-slate-900">{averageRating} Average Rating</p>
          </div>
          <Award className="w-5 h-5 text-primary-600" />
        </div>
      </div>
    </motion.div>
  )
}

// Listings Section
function ListingsSection({ listings = [], onAddListing = () => {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-bold text-slate-900">Your Listings</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddListing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </motion.button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No listings yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow bg-white group"
            >
              {/* Image */}
              {property.image && (
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      property.status === 'active'
                        ? 'bg-emerald-600'
                        : property.status === 'inactive'
                          ? 'bg-slate-600'
                          : 'bg-amber-600'
                    }`}>
                      {property.status || 'Active'}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h4 className="font-semibold text-slate-900">{property.title}</h4>
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {property.location}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                  <Eye className="w-4 h-4" />
                  <span>{property.views || 0} views</span>
                  <span className="mx-1">•</span>
                  <Users className="w-4 h-4" />
                  <span>{property.bookings || 0} bookings</span>
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <p className="font-bold text-slate-900">${property.price}/night</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-slate-700">{property.rating || '4.9'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Earnings Overview Section
function EarningsSection({ earnings = [] }) {
  const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0)
  const avgEarning = earnings.length > 0 ? totalEarnings / earnings.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Earnings Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase mb-2">Total Earnings</p>
          <p className="text-2xl font-bold text-green-700">${totalEarnings}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Avg Per Booking</p>
          <p className="text-2xl font-bold text-blue-700">${avgEarning.toFixed(0)}</p>
        </div>
      </div>

      {/* Earnings History */}
      <div className="max-h-80 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Earnings</h3>
        {earnings.length === 0 ? (
          <p className="text-center text-slate-600 py-8">No earnings yet.</p>
        ) : (
          <div className="space-y-2">
            {earnings.slice(0, 10).map((earning, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{earning.bookingTitle}</p>
                  <p className="text-xs text-slate-600">{new Date(earning.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-green-700">${earning.amount}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Host Reviews Section
function HostReviewsSection({ reviews = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Reviews from Guests</h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No reviews yet. Complete your first booking!</p>
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
                  <h4 className="font-semibold text-slate-900">{review.guestName}</h4>
                  <p className="text-xs text-slate-500">{review.propertyTitle}</p>
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

// Availability overview
function CalendarSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-slate-900">Availability Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Availability is managed in your listings</p>
          <p className="mt-2 text-sm text-slate-600">Use the listings workspace to update pricing, visibility, and booking readiness for each property.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Quick status snapshot</p>
          <p className="mt-2 text-sm text-slate-600">Calendar-specific blocking is not shown here yet, but your active listings and booking flow remain fully available.</p>
        </div>
      </div>
    </motion.div>
  )
}

// Main HostView Component
export default function HostView({
  user,
  stats = {},
  listings = [],
  earnings = [],
  reviews = [],
  onAddListing = () => {},
}) {
  return (
    <div className="space-y-6">
      <DashboardSummary stats={stats} />
      <ListingsSection listings={listings} onAddListing={onAddListing} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsSection earnings={earnings} />
        <HostReviewsSection reviews={reviews} />
      </div>
      <CalendarSection />
    </div>
  )
}
