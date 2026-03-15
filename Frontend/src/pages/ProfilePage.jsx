import React, { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Edit3, X, Check, Mail, User, AtSign,
  FileText, Shield, Loader2, Home, ArrowRight,
} from 'lucide-react'
import { DEMO_MODE } from '../config/demo'

const USER_STORAGE_KEY = 'user'

// ── Default avatar ────────────────────────────────────────────
function getInitials(name) {
  return (name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ── Editable Field ────────────────────────────────────────────
function InfoField({ icon: Icon, label, value, isEditing, name, onChange, type = 'text', placeholder, multiline }) {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-primary-500">{label}</label>
        <div className="relative">
          <div className="absolute left-3.5 top-3 text-primary-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
          {multiline ? (
            <textarea
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-200 bg-primary-100 text-sm text-primary-900 outline-none resize-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-200 bg-primary-100 text-sm text-primary-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary-400">{label}</p>
        <p className="text-sm font-medium text-primary-900 mt-0.5 break-words">
          {value || <span className="text-primary-300 italic">Non renseigné</span>}
        </p>
      </div>
    </div>
  )
}

// ── Main Profile Page ─────────────────────────────────────────
export default function ProfilePage({ user, onUserUpdate }) {
  const fileInputRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [switching, setSwitching] = useState(false)
  const [showHostConfirm, setShowHostConfirm] = useState(false)

  // Form state – initialised from user
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarClick = () => {
    if (editing) fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
      setForm(prev => ({ ...prev, avatar: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)

    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 600))
    }

    // Build updated user and persist
    const updatedUser = {
      ...user,
      name: form.name.trim() || user.name,
      username: form.username.trim(),
      email: form.email.trim() || user.email,
      bio: form.bio.trim(),
      avatar: form.avatar,
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    onUserUpdate?.(updatedUser)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setAvatarPreview(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    })
    setAvatarPreview(null)
    setEditing(false)
  }

  const handleBecomeHost = async () => {
    setSwitching(true)
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 800))
    }
    const updatedUser = { ...user, role: 'PROPRIETOR' }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    localStorage.setItem('userRole', 'PROPRIETOR')
    onUserUpdate?.(updatedUser)
    setSwitching(false)
    setShowHostConfirm(false)
  }

  const isTenant = user.role === 'TENANT' || user.role === 'CLIENT' || user.role === 'USER'

  const displayAvatar = avatarPreview || form.avatar || user.avatar

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* ── Header Banner ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-800 p-8 pb-20 mb-[-3.5rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(184,98,42,0.2)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">Mon Profil</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-50 mt-1">
                {editing ? 'Modifier le profil' : `Bonjour, ${user.name} 👋`}
              </h1>
            </div>
            {!editing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50/10 backdrop-blur-sm border border-primary-50/20 text-sm font-semibold text-primary-50 hover:bg-primary-50/20 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Modifier
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ── Profile Card ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-primary-50 border border-primary-200 rounded-3xl shadow-glass p-6 sm:p-8"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="relative group">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={form.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-50 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 ring-4 ring-primary-50 shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-primary-50">{getInitials(form.name)}</span>
                </div>
              )}
              {editing && (
                <button
                  onClick={handleAvatarClick}
                  className="absolute inset-0 rounded-full bg-primary-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-primary-50" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {!editing && (
              <div className="text-center mt-3">
                <h2 className="text-xl font-extrabold text-primary-900">{user.name}</h2>
                {user.username && (
                  <p className="text-sm text-primary-500 mt-0.5">@{user.username}</p>
                )}
              </div>
            )}
          </div>

          {/* Bio in view mode */}
          {!editing && user.bio && (
            <div className="text-center mb-6 px-4">
              <p className="text-sm text-primary-700 leading-relaxed italic">"{user.bio}"</p>
            </div>
          )}

          {/* Role badge */}
          {!editing && (
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-xs font-bold text-primary-700">
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-primary-200 mb-6" />

          {/* Fields */}
          <div className="space-y-1">
            <InfoField
              icon={User}
              label="Nom complet"
              value={editing ? form.name : user.name}
              isEditing={editing}
              name="name"
              onChange={handleChange}
              placeholder="Votre nom complet"
            />
            <InfoField
              icon={AtSign}
              label="Nom d'utilisateur"
              value={editing ? form.username : user.username}
              isEditing={editing}
              name="username"
              onChange={handleChange}
              placeholder="votre_pseudo"
            />
            <InfoField
              icon={Mail}
              label="Adresse email"
              value={editing ? form.email : user.email}
              isEditing={editing}
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="vous@exemple.com"
            />
            <InfoField
              icon={FileText}
              label="Bio"
              value={editing ? form.bio : user.bio}
              isEditing={editing}
              name="bio"
              onChange={handleChange}
              placeholder="Parlez-nous de vous..."
              multiline
            />
          </div>

          {/* Action buttons */}
          <AnimatePresence mode="wait">
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-3 mt-6 pt-6 border-t border-primary-200"
              >
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-200 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  <X className="w-4 h-4" /> Annuler
                </button>
                <motion.button
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-sm font-bold text-primary-50 shadow-md transition-all disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save confirmation toast */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-center gap-2 justify-center py-2.5 rounded-xl bg-primary-100 border border-primary-200"
              >
                <Check className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Profil mis à jour avec succès</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Become a Host CTA ────────────────────────────── */}
        {isTenant && !editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 relative rounded-3xl overflow-hidden border border-primary-200 bg-primary-50 shadow-glass"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-400/5" />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-md">
                  <Home className="w-6 h-6 text-primary-50" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-primary-900">Devenez Hôte</h3>
                  <p className="text-sm text-primary-600 mt-1 leading-relaxed">
                    Vous avez un bien à proposer ? Passez en mode Propriétaire pour publier vos annonces et gérer vos réservations.
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!showHostConfirm ? (
                  <motion.button
                    key="cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHostConfirm(true)}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-sm font-bold text-primary-50 shadow-md hover:shadow-lg transition-all"
                  >
                    Devenir Propriétaire <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5 p-4 rounded-xl bg-primary-100 border border-primary-200"
                  >
                    <p className="text-sm font-semibold text-primary-800 text-center mb-3">
                      Confirmer le passage en mode Propriétaire ?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowHostConfirm(false)}
                        disabled={switching}
                        className="flex-1 py-2.5 rounded-xl border border-primary-200 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-50"
                      >
                        Annuler
                      </button>
                      <motion.button
                        whileHover={!switching ? { scale: 1.02 } : {}}
                        whileTap={!switching ? { scale: 0.98 } : {}}
                        onClick={handleBecomeHost}
                        disabled={switching}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-sm font-bold text-primary-50 shadow-md transition-all disabled:opacity-70"
                      >
                        {switching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {switching ? 'En cours...' : 'Confirmer'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
