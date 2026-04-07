import React, { useState, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Check, X, Loader2, Mail, Phone, Shield,
  AlertCircle, BadgeCheck, User, AtSign, FileText,
} from 'lucide-react'
import { DEMO_MODE } from '../data/demo'
import PortfolioHeader from '../components/profile/PortfolioHeader'
import PortfolioGrid from '../components/profile/PortfolioGrid'
import RoleSwitcher from '../components/profile/RoleSwitcher'
import GuestView from '../components/profile/GuestView'
import HostView from '../components/profile/HostView'
import ProfileSettings from '../components/profile/ProfileSettings'

// Import mock data
import {
  MOCK_GUEST_BOOKINGS,
  MOCK_GUEST_REVIEWS,
  MOCK_WISHLIST,
  MOCK_HOST_STATS,
  MOCK_HOST_LISTINGS,
  MOCK_HOST_EARNINGS,
  MOCK_HOST_REVIEWS,
} from '../services/profileMockData'

const USER_STORAGE_KEY = 'user'
const AUTH_TOKEN_KEY = 'authToken'
const ROLE_STORAGE_KEY = 'userRole'
const DISPLAY_ROLE_KEY = 'displayRole'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const MAX_AVATAR_SIZE = 320

// Avatar utilities
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read selected image'))
    reader.readAsDataURL(file)
  })
}

async function compressAvatar(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.')
  }

  const sourceDataUrl = await fileToDataUrl(file)
  const img = new Image()

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = () => reject(new Error('Selected image could not be loaded.'))
    img.src = sourceDataUrl
  })

  const scale = Math.min(MAX_AVATAR_SIZE / img.width, MAX_AVATAR_SIZE / img.height, 1)
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to process selected image.')
  }

  context.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

// Edit Profile Modal Component
function EditProfileModal({ user, onSave, onCancel, onUserUpdate }) {
  const fileInputRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    compressAvatar(file)
      .then((compressedAvatar) => {
        setSaveError('')
        setAvatarPreview(compressedAvatar)
        setForm(prev => ({ ...prev, avatar: compressedAvatar }))
      })
      .catch((error) => {
        setSaveError(error?.message || 'Unable to update profile picture.')
      })
  }

  const handleSave = async () => {
    setSaveError('')
    setSaving(true)

    const updatedUser = {
      ...user,
      name: form.name.trim() || user.name,
      fullName: form.name.trim() || user.fullName,
      username: form.username.trim(),
      email: form.email.trim() || user.email,
      bio: form.bio.trim(),
      avatar: form.avatar,
    }

    try {
      if (!DEMO_MODE) {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        if (!token) {
          throw new Error('Session expired. Please sign in again.')
        }

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: updatedUser.name,
            avatar: updatedUser.avatar || '',
          }),
        })

        if (!response.ok) {
          let message = 'Unable to save profile.'
          try {
            const payload = await response.json()
            if (payload?.message) message = payload.message
          } catch {
            // ignore
          }
          throw new Error(message)
        }

        const backendUser = await response.json()
        const mergedUser = {
          ...updatedUser,
          name: backendUser?.fullName || backendUser?.name || updatedUser.name,
          avatar: backendUser?.avatar ?? updatedUser.avatar,
        }
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mergedUser))
        onUserUpdate?.(mergedUser)
      } else {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
        onUserUpdate?.(updatedUser)
      }

      setSaved(true)
      setTimeout(() => onSave?.(), 800)
    } catch (error) {
      setSaveError(error?.message || 'Could not save profile. Try a smaller image.')
    } finally {
      setSaving(false)
    }
  }

  const displayAvatar = avatarPreview || form.avatar || user?.avatar

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={form.name}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-slate-200 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 ring-4 ring-slate-200 shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {form.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </span>
                </div>
              )}
              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition resize-none"
              />
            </div>
          </div>

          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {saveError}
            </div>
          )}

          {saved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Profile updated successfully!
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={!saving ? { scale: 1.02 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg font-semibold text-white hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main ProfilePage Component
export default function ProfilePage({ user, onUserUpdate }) {
  const navigate = useNavigate()
  const [displayRole, setDisplayRole] = useState(() => {
    return localStorage.getItem(DISPLAY_ROLE_KEY) || 'GUEST'
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!user) {
    return <Navigate to="/" replace />
  }

  // Determine if user is a host
  const isHost = user?.role === 'PROPRIETOR' || user?.role === 'HOST'

  // Handle role switching
  const handleRoleChange = (role) => {
    setDisplayRole(role)
    localStorage.setItem(DISPLAY_ROLE_KEY, role)
  }

  // Handle become host
  const handleBecomeHost = () => {
    navigate('/host-verification')
  }

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  // Handle settings click
  const handleSettingClick = (action) => {
    switch (action) {
      case 'edit_profile':
        handleEditProfile()
        break
      case 'logout':
        localStorage.removeItem(USER_STORAGE_KEY)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(ROLE_STORAGE_KEY)
        localStorage.removeItem(DISPLAY_ROLE_KEY)
        navigate('/')
        break
      case 'help':
        // Navigate to help or open support
        break
      default:
        // Handle other settings
        break
    }
  }

  // Calculate trust score (0-100)
  const calculateTrustScore = () => {
    let score = 50
    if (user?.emailVerified) score += 15
    if (user?.phoneVerified) score += 15
    if (user?.identityStatus === 'approved') score += 20
    return Math.min(score, 100)
  }

  const trustScore = calculateTrustScore()
  const totalStaysCompleted = MOCK_GUEST_BOOKINGS.filter(b => b.status === 'completed').length

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Portfolio Header */}
        <PortfolioHeader
          user={user}
          role={displayRole}
          onEdit={handleEditProfile}
          onBecomeHost={!isHost ? handleBecomeHost : null}
          totalStaysCompleted={totalStaysCompleted}
          trustScore={trustScore}
          isSuperHost={isHost && MOCK_HOST_STATS.totalEarnings > 5000}
          memberSince={user?.createdAt}
          reviewCount={displayRole === 'GUEST' ? MOCK_GUEST_REVIEWS.length : MOCK_HOST_REVIEWS.length}
        />

        {/* Role Switcher */}
        <div className="mt-6">
          <RoleSwitcher
            currentRole={displayRole}
            isHost={isHost}
            onRoleChange={handleRoleChange}
            onBecomeHost={handleBecomeHost}
          />
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-3">
            {displayRole === 'GUEST' ? (
              <GuestView
                user={user}
                bookings={MOCK_GUEST_BOOKINGS}
                reviews={MOCK_GUEST_REVIEWS}
                wishlist={MOCK_WISHLIST}
              />
            ) : (
              <HostView
                user={user}
                stats={MOCK_HOST_STATS}
                listings={MOCK_HOST_LISTINGS}
                earnings={MOCK_HOST_EARNINGS}
                reviews={MOCK_HOST_REVIEWS}
                onAddListing={() => navigate('/add-property')}
              />
            )}
          </div>

          {/* Sidebar Settings */}
          <ProfileSettings onSettingClick={handleSettingClick} isOpen={true} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onSave={() => setIsEditModalOpen(false)}
            onCancel={() => setIsEditModalOpen(false)}
            onUserUpdate={onUserUpdate}
          />
        )}
      </AnimatePresence>
    </section>
  )
  return (
    <section className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Portfolio Header */}
        <PortfolioHeader
          user={user}
          role={displayRole}
          onEdit={handleEditProfile}
          onBecomeHost={!isHost ? handleBecomeHost : null}
          totalStaysCompleted={totalStaysCompleted}
          trustScore={trustScore}
          isSuperHost={isHost && MOCK_HOST_STATS.totalEarnings > 5000}
          memberSince={user?.createdAt}
          reviewCount={displayRole === 'GUEST' ? MOCK_GUEST_REVIEWS.length : MOCK_HOST_REVIEWS.length}
        />

        {/* Role Switcher */}
        <div className="mb-12">
          <RoleSwitcher
            currentRole={displayRole}
            isHost={isHost}
            onRoleChange={handleRoleChange}
            onBecomeHost={handleBecomeHost}
          />
        </div>

        {/* Portfolio Grid Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              {displayRole === 'GUEST' ? 'My Bookings' : 'My Listings'}
            </h2>
            <p className="text-primary-600">
              {displayRole === 'GUEST'
                ? 'View all your past and upcoming bookings'
                : 'Manage and showcase your properties'}
            </p>
          </motion.div>

          <PortfolioGrid
            items={displayRole === 'GUEST' ? MOCK_GUEST_BOOKINGS : MOCK_HOST_LISTINGS}
            role={displayRole}
            emptyMessage={displayRole === 'GUEST' ? 'No bookings yet' : 'No listings yet'}
          />
        </div>

        {/* Additional Sections */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              More Information
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {displayRole === 'GUEST' ? (
                <GuestView
                  user={user}
                  bookings={MOCK_GUEST_BOOKINGS}
                  reviews={MOCK_GUEST_REVIEWS}
                  wishlist={MOCK_WISHLIST}
                />
              ) : (
                <HostView
                  user={user}
                  stats={MOCK_HOST_STATS}
                  listings={MOCK_HOST_LISTINGS}
                  earnings={MOCK_HOST_EARNINGS}
                  reviews={MOCK_HOST_REVIEWS}
                  onAddListing={() => navigate('/add-property')}
                />
              )}
            </div>

            {/* Sidebar Settings */}
            <ProfileSettings onSettingClick={handleSettingClick} isOpen={true} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onSave={() => setIsEditModalOpen(false)}
            onCancel={() => setIsEditModalOpen(false)}
            onUserUpdate={onUserUpdate}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
