import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star, Zap, ExternalLink } from 'lucide-react'

export default function PortfolioGrid({ 
  items = [], 
  role = 'GUEST',
  emptyMessage = 'No items yet'
}) {
  const [hoveredId, setHoveredId] = useState(null)

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <div className="text-primary-600 text-lg">{emptyMessage}</div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(item.id || idx)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Container */}
            <div className="relative h-72 overflow-hidden bg-primary-200">
              <img
                src={item.image || item.photos?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop'}
                alt={item.name || item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badge */}
              {item.featured && (
                <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                  <Zap size={14} /> Featured
                </div>
              )}

              {/* Heart/Wishlist - Guest Only */}
              {role === 'GUEST' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white hover:bg-primary-100 flex items-center justify-center shadow-lg transition-colors"
                >
                  <Heart size={20} className="text-primary-600" fill="currentColor" />
                </motion.button>
              )}

              {/* Info Overlay - Show on Hover */}
              {hoveredId === (item.id || idx) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-end justify-end p-4"
                >
                  <div className="text-white space-y-1 text-right">
                    <p className="text-sm opacity-90">{item.type === 'booking' ? 'Booking' : 'Property'}</p>
                    <p className="text-lg font-semibold">{item.status || 'Active'}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-primary-900 mb-1 line-clamp-2">
                  {item.name || item.title || item.propertyName}
                </h3>
                <div className="flex items-center gap-2 text-primary-600 text-sm mb-3">
                  <MapPin size={14} />
                  <span>{item.location || item.address || 'Location'}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary-200">
                {item.rating || item.stars ? (
                  <div className="flex items-center gap-1">
                    <span className="text-primary-900 font-bold">{item.rating || item.stars}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(item.rating || item.stars) ? 'fill-yellow-400 text-yellow-400' : 'text-primary-300'}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                
                {item.reviewCount && (
                  <span className="text-primary-600 text-sm">
                    {item.reviewCount} review{item.reviewCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Price or Info */}
              <div className="space-y-2 mb-4">
                {item.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 text-sm">Price</span>
                    <span className="text-primary-900 font-bold text-lg">${item.price}/night</span>
                  </div>
                )}
                
                {item.checkInDate && (
                  <div className="text-primary-600 text-sm">
                    <span>{new Date(item.checkInDate).toLocaleDateString()} - {new Date(item.checkOutDate).toLocaleDateString()}</span>
                  </div>
                )}

                {item.status && (
                  <div className="inline-block">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      'bg-primary-100 text-primary-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group/btn"
              >
                <span>View Details</span>
                <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
