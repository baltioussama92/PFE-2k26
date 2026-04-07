import React from 'react'
import { motion } from 'framer-motion'
import {
  BadgeCheck, Shield, Calendar, Mail, Phone, Users
} from 'lucide-react'

export default function PortfolioHeader({
  user,
  role,
  onEdit,
  onBecomeHost,
  totalStaysCompleted,
  trustScore,
  isSuperHost,
  memberSince,
  reviewCount
}) {
  const memberDate = memberSince ? new Date(memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Recently'

  const stats = [
    { label: 'Member Since', value: memberDate },
    { label: 'Trust Score', value: `${trustScore || 0}%` },
    { label: 'Reviews', value: reviewCount || 0 }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full mb-12"
    >
      <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Image & Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <motion.div
                variants={imageVariants}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`}
                    alt={user?.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover bg-primary-300 ring-4 ring-white shadow-lg"
                  />
                  {isSuperHost && (
                    <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                      <Shield size={16} />
                      Super Host
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Name & Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
                    {user?.name || 'User'}
                  </h1>
                  {user?.isVerified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      <BadgeCheck size={14} /> Verified
                    </motion.div>
                  )}
                </div>

                <p className="text-primary-600 text-lg mb-4">
                  {role === 'HOST' ? 'Property Host' : 'Guest'} based in {user?.city || 'Somewhere'}
                </p>

                <p className="text-primary-700 text-sm mb-6 max-w-2xl leading-relaxed">
                  {user?.bio || 'Passionate about creating memorable experiences and building meaningful connections with the community.'}
                </p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {user?.emailVerified && (
                    <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg text-primary-700 text-sm border border-primary-200">
                      <Mail size={14} /> Email Verified
                    </div>
                  )}
                  {user?.phoneVerified && (
                    <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg text-primary-700 text-sm border border-primary-200">
                      <Phone size={14} /> Phone Verified
                    </div>
                  )}
                  {user?.isVerified && (
                    <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg text-primary-700 text-sm border border-primary-200">
                      <BadgeCheck size={14} /> Identity Verified
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEdit}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                  {role !== 'HOST' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onBecomeHost}
                      className="px-6 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-colors"
                    >
                      Become a Host
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-primary-200 hover:border-primary-400 transition-colors"
                >
                  <p className="text-primary-600 text-xs font-semibold uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-primary-900 text-2xl font-bold">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
