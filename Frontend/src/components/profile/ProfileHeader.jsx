import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Calendar, BadgeCheck, Shield, MapPin, Star } from 'lucide-react'

const getInitials = (name) => {
  return (name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ProfileHeader({
  user,
  role,
  onEdit,
  onBecomeHost,
  totalStaysCompleted = 0,
  trustScore = 0,
  isSuperHost = false,
}) {
  const getVerificationStatus = () => {
    if (user?.identityStatus === 'approved' || user?.identityStatus === 'verified') {
      return { label: 'Verified', color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
    }
    if (user?.identityStatus === 'pending') {
      return { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50' }
    }
    return { label: 'Not Verified', color: 'text-primary-400', bgColor: 'bg-primary-50' }
  }

  const verificationStatus = getVerificationStatus()
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()
  const displayName = user?.name || user?.fullName || 'User'
  const displayAvatar = user?.avatar

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(184,98,42,0.15)_0%,transparent_60%)]" />

      <div className="relative z-10 p-8">
        {/* Header Top - Name and Edit Button */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile</p>
            <h1 className="text-3xl font-bold text-white mt-1">{displayName}</h1>
          </div>
          {!onBecomeHost && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-semibold">Edit</span>
            </motion.button>
          )}
        </div>

        {/* Profile Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Avatar and Name */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative mb-4"
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 ring-4 ring-white/20 shadow-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{getInitials(displayName)}</span>
                </div>
              )}

              {/* Verification Badge */}
              {user?.emailVerified && role !== 'ADMIN' && (
                <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 ring-2 ring-white shadow-lg">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Super Host Badge */}
              {isSuperHost && (
                <div className="absolute top-1 right-1 bg-yellow-500 rounded-full px-2 py-1 ring-2 ring-white shadow-lg">
                  <span className="text-xs font-bold text-white">Super Host</span>
                </div>
              )}
            </motion.div>

            {/* Username and Location (if available) */}
            {user?.username && (
              <p className="text-sm font-medium text-slate-300 text-center md:text-left">@{user.username}</p>
            )}
          </div>

          {/* Right: Info Cards */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Verification Status */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary-300" />
                <span className="text-xs font-semibold text-slate-400">Verification</span>
              </div>
              <p className={`text-sm font-bold ${verificationStatus.color}`}>
                {verificationStatus.label}
              </p>
            </div>

            {/* Member Since */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary-300" />
                <span className="text-xs font-semibold text-slate-400">Member</span>
              </div>
              <p className="text-sm font-bold text-emerald-400">Since {memberSince}</p>
            </div>

            {/* Trust Score or Stays */}
            {role === 'GUEST' ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary-300" />
                  <span className="text-xs font-semibold text-slate-400">Stays</span>
                </div>
                <p className="text-sm font-bold text-blue-400">{totalStaysCompleted} Completed</p>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary-300" />
                  <span className="text-xs font-semibold text-slate-400">Score</span>
                </div>
                <p className="text-sm font-bold text-yellow-400">{trustScore}%</p>
              </div>
            )}

            {/* Bio (if host and has bio) */}
            {role === 'HOST' && user?.bio && (
              <div className="col-span-2 sm:col-span-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 mb-2">About</p>
                <p className="text-sm text-slate-200 italic leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button for non-hosts */}
        {onBecomeHost && role === 'GUEST' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBecomeHost}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold hover:shadow-xl transition-all"
          >
            🏠 Become a Host
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
